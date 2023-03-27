import { LLMModels, Message } from './types';
import { LLMModel } from './llmmodel';
import { OpenAIApi, Configuration } from 'openai';

// Example implementation of the LLMModel interface for GPT-3.5 Turbo
export class Gpt3_5Turbo implements LLMModel {
  private apiKey: string;
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAIApi(new Configuration({ apiKey: this.apiKey }));
  }

  getModelName(): string {
    return 'GPT-3.5 Turbo';
  }

  async call(prompt: Message[]): Promise<string> {
    const completion = await this.openai.createChatCompletion({
      model: LLMModels.GPT_3_5_Turbo,
      messages: prompt,
    });
    return completion.data.choices[0].message?.content as string;
  }
}