import { ConfigService } from '@nestjs/config';
import { OpenAIService } from './openai.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenAIService', () => {
  let service: OpenAIService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('dummy-openai-key'),
    } as any;

    service = new OpenAIService(configService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('evaluate should return evaluation', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: 8,
                feedback: 'Good structure, minor grammatical errors.',
                highlights: ['grammatical errors'],
              }),
            },
          },
        ],
      },
    });

    const result = await service.evaluate('test essay');

    expect(result).toEqual({
      result: 'ok',
      score: 8,
      feedback: 'Good structure, minor grammatical errors.',
      highlights: ['grammatical errors'],
      latency: expect.any(Number),
    });
  });

  it('evaluate should handle errors gracefully', async () => {
    mockedAxios.post.mockRejectedValue(new Error('OpenAI API error'));

    const result = await service.evaluate('test essay');

    expect(result).toEqual({
      result: 'failed',
      score: 0,
      feedback: 'AI 평가에 실패했습니다.',
      highlights: [],
      latency: expect.any(Number),
    });
  });
});
