export type FieldResult = {
  value: string | number | boolean | Date | null;
  source: string;
  confidence: number;
};

// Define a type for the fields object, where each key is a string and each value is of type FieldResult
export type FieldsResultObject = {
  [key: string]: FieldResult;
};

export enum ExtractorType {
  MapAndReduce = 'map-and-reduce',
}
