import { crudeTokenizer } from '../../utils/tokenizer';
import { CONTEXT_SIZES, LLMModels, Message } from '../types';
import { BaseLLM } from './base';
import { OpenAIApi, Configuration } from 'openai';

export class Gpt3_5Turbo implements BaseLLM {
  private apiKey: string;
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAIApi(new Configuration({ apiKey: this.apiKey }));
  }

  getModelName(): string {
    return LLMModels.GPT_3_5_Turbo;
  }

  async call(prompt: Message[]): Promise<string> {
    const maxTokens =
      CONTEXT_SIZES[LLMModels.GPT_3_5_Turbo] -
      crudeTokenizer(JSON.stringify(prompt));

    const completion = await this.openai.createChatCompletion({
      model: LLMModels.GPT_3_5_Turbo,
      messages: prompt,
      max_tokens: maxTokens,
      temperature: 0,
    });
    return completion.data.choices[0].message?.content as string;
  }
}
