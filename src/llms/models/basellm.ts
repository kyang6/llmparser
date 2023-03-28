import { Message } from '../types';

// Define an interface for the different LLM models
export interface BaseLLM {
  getModelName(): string;
  call(prompt: string | Message[]): Promise<string>;
}
