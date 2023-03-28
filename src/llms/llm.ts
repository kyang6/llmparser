import { BaseLLM } from './models/basellm';
import { Gpt3_5Turbo, Gpt3_5, Gpt4 } from './models';
import { LLMModels, CONTEXT_SIZES, Message, LLMModelsType } from './types';

// Define the LLM class
export class LLM {
  private readonly modelName: LLMModelsType;
  private readonly model: BaseLLM;

  constructor(apiKey: string, modelName: LLMModelsType) {
    this.modelName = modelName;

    // Initialize the appropriate model based on the modelName parameter
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

  // Method to generate text using the selected model
  public async call(prompt: string | Message[]): Promise<string> {
    return this.model.call(prompt);
  }

  // Method to get the context size of the selected model
  public getContextSize(): number {
    return CONTEXT_SIZES[this.modelName];
  }

  // Method to check if the model is a chat model
  public isChatModel(): boolean {
    return this.modelName === LLMModels.GPT_3_5_Turbo;
  }
}
