// src/openai/openai.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { envVariables } from '../const/env.const';

@Injectable()
export class OpenAIService {
  private url: string;

  constructor(private configService: ConfigService) {
    this.url = `${configService.get<string>(envVariables.azureOpenAIEndpoint)}/openai/deployments/${configService.get<string>(envVariables.azureOpenAIDeployment)}/chat/completions?api-version=${configService.get<string>(envVariables.azureOpenAIApiVersion)}`;
  }

  async evaluate(submitText: string) {
    const start = Date.now();

    const response = await axios.post(
      this.url,
      {
        messages: [
          { role: 'system', content: 'You are an English essay evaluator.' },
          { role: 'user', content: submitText },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'api-key': this.configService.get<string>(
            envVariables.azureOpenAIKey,
          ),
          'Content-Type': 'application/json',
        },
      },
    );

    const end = Date.now();
    const latency = end - start;

    const parsed = JSON.parse(response.data.choices[0].message.content);

    return {
      score: parsed.score,
      feedback: parsed.feedback,
      highlights: parsed.highlights,
      latency,
    };
  }
}
