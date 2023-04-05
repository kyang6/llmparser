import { BaseLLM } from './base';

import { OpenAIApi, Configuration } from 'openai';
import { CONTEXT_SIZES, LLMModels } from '../types';
import { crudeTokenizer } from '../../utils/tokenizer';

export class Gpt3_5 implements BaseLLM {
  private apiKey: string;
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAIApi(new Configuration({ apiKey: this.apiKey }));
  }

  getModelName(): string {
    return LLMModels.GPT_3_5;
  }

  async call(prompt: string): Promise<string> {
    const maxTokens = CONTEXT_SIZES[LLMModels.GPT_3_5] - crudeTokenizer(prompt);

    try {
      const completion = await this.openai.createCompletion({
        model: LLMModels.GPT_3_5,
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: 0,
      });

      return completion.data.choices[0].text as string;
    } catch (e) {
      return JSON.stringify(e);
    }
  }
}
