import { LLM } from '../llms';
import { Field } from '../parser';
import { FieldsResultObject } from './types';

/*
 * This is the base class for all field extractors. It is responsible for defining the interface
 * that all field extractors must implement.
 */
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
