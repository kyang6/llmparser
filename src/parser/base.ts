import { LLM } from '../llms';
import { LLMModels, Message } from '../llms/types';

interface Field {
  name: string;
  description: string;
  type: string;
}

interface Category {
  name: string;
  description: string;
  fields?: Field[];
}

interface LLMParserParams {
  categories?: Category[];
  fields?: Field[];
  llm: LLM;
  model: LLMModels;
}

interface LLMParserOptions {
  categories?: Category[];
  fields?: Field[];
  apiKey: string;
  model: string;
}

export class LLMParser implements LLMParserParams {
  categories?: Category[];
  fields?: Field[];
  llm: LLM;
  model: LLMModels;

  constructor(options: LLMParserOptions) {
    if (!options.categories && !options.fields) {
      throw new Error('Either categories or fields must be provided');
    }
    if (options.categories) {
      this.categories = options.categories;
    } else if (options.fields) {
      this.fields = options.fields;
    }
    this.model = options.model as LLMModels;
    this.llm = new LLM({ apiKey: options.apiKey, modelName: options.model });
  }

  async parse(document: string): Promise<any> {
    if (this.model === LLMModels.GPT_3_5_Turbo) {
      const messages: Message[] = [
        {
          role: 'system',
          content: 'You are a JSON parser',
        },
        {
          role: 'user',
          content: document,
        },
      ];
      const resp = await this.llm.call(messages);
      return resp;
    }
    const resp = await this.llm.call(document);
    return resp;
  }
}
