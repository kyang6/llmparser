import { LLMModel } from './llmmodel';
import { Gpt3_5Turbo } from './gpt3_5turbo';
import { Gpt3_5 } from './gpt3_5';
import { Gpt4 } from './gpt4';
import { LLMModels, CONTEXT_SIZES, Message } from './types';

// Define a class for LLM parameters
export class LLMParams {
  apiKey: string;
  modelName: string;

  constructor(apiKey: string, modelName: string) {
    this.apiKey = apiKey;
    this.modelName = modelName;
  }
}

// Define the LLM class that extends LLMParams
export class LLM extends LLMParams {
  private model: LLMModel;

  constructor(params: LLMParams) {
    super(params.apiKey, params.modelName);
    // Initialize the appropriate model based on the modelName parameter

    switch (params.modelName) {
      case LLMModels.GPT_3_5_Turbo:
        this.model = new Gpt3_5Turbo(params.apiKey);
        break;
      case LLMModels.GPT_3_5:
        this.model = new Gpt3_5(params.apiKey);
        break;
      case LLMModels.GPT_4:
        this.model = new Gpt4(params.apiKey);
        break;
      default:
        throw new Error('Invalid model name');
    }
  }

  // Method to generate text using the selected model
  async call(prompt: string | Message[]): Promise<string> {
    return this.model.call(prompt);
  }

  // Method to get the context size of the selected model
  getContextSize(): number {
    return CONTEXT_SIZES[this.modelName as LLMModels];
  }
}
