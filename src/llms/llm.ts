import { BaseLLM } from './models/base';
import { Gpt3_5Turbo, Gpt3_5, Gpt4 } from './models';
import { LLMModels, CONTEXT_SIZES, Message, LLMModelsType } from './types';

/*
 * This is a wrapper class for LLMs. It is responsible for instantiating the
 * correct LLM model based on the model name passed in.
 */
export class LLM {
  private readonly modelName: LLMModelsType;
  private readonly model: BaseLLM;

  constructor(apiKey: string, modelName: LLMModelsType) {
    this.modelName = modelName;

    switch (modelName) {
      case LLMModels.GPT_3_5_Turbo:
        this.model = new Gpt3_5Turbo(apiKey);
        break;
      case LLMModels.GPT_3_5:
        this.model = new Gpt3_5(apiKey);
        break;
      case LLMModels.GPT_4:
        this.model = new Gpt4(apiKey);
        break;
      default:
        throw new Error('Invalid model name');
    }
  }

  public async call(prompt: string | Message[]): Promise<string> {
    return this.model.call(prompt);
  }

  public getContextSize(): number {
    return CONTEXT_SIZES[this.modelName];
  }

  public isChatModel(): boolean {
    return this.modelName === LLMModels.GPT_3_5_Turbo;
  }
}
