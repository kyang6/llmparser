import { MapReduceExtractor } from './extraction-techniques/map-reduce/map-reduce';

export type PossibleFieldValues = string | number | boolean | Date | null;

export type FieldResult = {
  value: PossibleFieldValues;
  source: string;
  confidence: number;
};

// Define a type for the fields object, where each key is a string and each value is of type FieldResult
export type FieldsResultObject = {
  [key: string]: FieldResult;
};

export type Extractor = MapReduceExtractor;
