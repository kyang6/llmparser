// Define an enum for the different LLM models
export enum LLMModels {
  GPT_3_5_Turbo = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
  GPT_3_5 = 'text-davinci-003',
}

// Define a constant for the context sizes of the different LLM models
export const CONTEXT_SIZES: {
  [key in LLMModels]: number;
} = {
  [LLMModels.GPT_3_5_Turbo]: 4096,
  [LLMModels.GPT_3_5]: 4097,
  [LLMModels.GPT_4]: 8192,
};

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user' | 'system';
