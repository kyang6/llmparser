import { Category } from '../llmparser';
import { ClassificationResult } from './types';
import { LLM } from '../llms';

/*
 * This is the base class for all classifiers. It is responsible for defining the interface
 * that all classifiers must implement.
 */
export abstract class ClassifierBase {
  protected llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  abstract classify(
    document: string,
    categories: Category[]
  ): Promise<ClassificationResult>;
}
