// Define an enum for the different LLM models
export enum LLMModels {
  GPT_3_5_Turbo = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
  GPT_3_5 = 'text-davinci-003',
}

export type LLMModelsType = 'gpt-3.5-turbo' | 'gpt-4' | 'text-davinci-003';

const BUFFER = 200; // token buffer to account for crude tokenization

// Define a constant for the context sizes of the different LLM models
export const CONTEXT_SIZES: {
  [key in LLMModels]: number;
} = {
  [LLMModels.GPT_3_5_Turbo]: 4000 - BUFFER,
  [LLMModels.GPT_3_5]: 4000 - BUFFER,
  [LLMModels.GPT_4]: 8000 - BUFFER,
};

// for Chat models
export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user' | 'system';
