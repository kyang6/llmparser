import { ClassificationResult } from '../classifier/types';

export interface Field {
  name: string;
  description: string;
  type: string;
}

export interface Category {
  name: string;
  description: string;
  fields?: Field[];
}

export type FieldResult = {
  value: string | number | boolean | Date | undefined | null | any;
  source: string;
  confidence: number;
};

// Define a type for the fields object, where each key is a string and each value is of type FieldResult
export type FieldsResultObject = {
  [key: string]: FieldResult;
};

export type ParseResult = Partial<ClassificationResult> & {
  fields?: FieldsResultObject;
};
