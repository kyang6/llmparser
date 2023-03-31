import { ClassificationResult } from '../classifier/types';
import { FieldsResultObject } from '../field_extractor/types';
import { LLMModelsType } from '../llms';

export interface Field {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'date';
}

export interface Category {
  name: string;
  description: string;
  fields?: Field[];
}

export type ParseResult = Partial<ClassificationResult> & {
  fields?: FieldsResultObject;
};

export interface LLMParserOptions {
  apiKey: string;
  categories?: Category[];
  fields?: Field[];
  model?: LLMModelsType;
}

export interface ParseParams {
  document: string;
  forceClassifyAs?: string;
}
