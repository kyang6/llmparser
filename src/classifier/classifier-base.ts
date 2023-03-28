import { Category } from '../parser';
import { ClassificationResult } from './types';
import { LLM } from '../llms';

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
