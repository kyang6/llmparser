import { LLMModel } from './llmmodel';

import { OpenAIApi, Configuration } from 'openai';
import { LLMModels } from './types';

// Example implementation of the LLMModel interface for GPT-3
export class Gpt3_5 implements LLMModel {
  private apiKey: string;
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAIApi(new Configuration({ apiKey: this.apiKey }));
  }

  getModelName(): string {
    return 'GPT-3';
  }

  async call(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.createCompletion({
        model: LLMModels.GPT_3_5,
        prompt: prompt,
      });

      return completion.data.choices[0].text as string;
    } catch (e) {
      return JSON.stringify(e);
    }
  }
}
