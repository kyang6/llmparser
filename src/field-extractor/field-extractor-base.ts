// classifier.ts
import { LLM } from '../llms';
import { Field } from '../parser';
import { FieldsResultObject } from './types';

export abstract class FieldExtractorBase {
  protected llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  abstract extract(
    document: string,
    fields: Field[]
  ): Promise<FieldsResultObject>;
}
