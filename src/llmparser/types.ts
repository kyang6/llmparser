import { ClassificationResult } from '../classifier/types';
import { FieldsResultObject } from '../field_extractor/types';

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
