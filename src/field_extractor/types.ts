import { MapReduceExtractor } from './extraction_techniques/map_reduce/map_reduce_extractor';

export type PossibleFieldValues = string | number | boolean | Date | null;

export type FieldResult = {
  value: PossibleFieldValues;
  source: string;
  confidence: number;
  type: 'string' | 'number' | 'boolean' | 'date';
};

// Define a type for the fields object, where each key is a string and each value is of type FieldResult
export type FieldsResultObject = {
  [key: string]: FieldResult;
};

export type Extractor = MapReduceExtractor;
