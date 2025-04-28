import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { envVariables } from '../const/env.const';
import { parseCleanJson } from '../utils/parse-openai-response.util';

interface OpenAIResponse {
  score: number;
  feedback: string;
  highlights: string[];
}

@Injectable()
export class OpenAIService {
  private readonly url: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>(
      envVariables.azureOpenAIEndpoint,
    )!;
    const deployment = this.configService.get<string>(
      envVariables.azureOpenAIDeployment,
    )!;
    const apiVersion = this.configService.get<string>(
      envVariables.azureOpenAIApiVersion,
    )!;

    this.apiKey = this.configService.get<string>(envVariables.azureOpenAIKey)!;
    this.url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  }

  async evaluate(submitText: string) {
    const start = Date.now();

    try {
      const response = await axios.post(
        this.url,
        {
          messages: [
            {
              role: 'system',
              content: `You are an English essay evaluator.
Evaluate the given English essay and respond ONLY in strict JSON format with the following fields:

- score: an integer from 0 to 10.
- feedback: simple comments for each paragraph or section.
- highlights: a list of sentences or words that caused point deductions.

Respond ONLY with JSON. Do not include any extra explanation or text.`,
            },
            {
              role: 'user',
              content: submitText,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      const end = Date.now();
      const latency = end - start;

      const content = response.data.choices?.[0]?.message?.content;
      console.log('🔥 OpenAI 응답 content:', content);

      if (!content) {
        throw new Error('Empty content from OpenAI response');
      }

      let parsed: OpenAIResponse;
      try {
        parsed = parseCleanJson(content!);
      } catch (error) {
        throw new Error('Invalid JSON format from AI response');
      }

      if (
        typeof parsed.score !== 'number' ||
        !parsed.feedback ||
        !Array.isArray(parsed.highlights)
      ) {
        throw new Error('AI response missing required fields');
      }

      return {
        result: 'ok',
        score: parsed.score,
        feedback: parsed.feedback,
        highlights: parsed.highlights,
        latency,
      };
    } catch (error: any) {
      const end = Date.now();
      const latency = end - start;

      // fallback 처리: 실패하면 기본 값 반환
      return {
        result: 'failed',
        score: 0,
        feedback: 'AI 평가에 실패했습니다.',
        highlights: [],
        latency,
      };
    }
  }
}
