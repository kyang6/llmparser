import { Message } from '../types';

/*
 * This is the base class for all LLMs. It is responsible for defining the interface
 * that all LLMs must implement.
 */
export interface BaseLLM {
  getModelName(): string;
  call(prompt: string | Message[]): Promise<string>;
}
