// classifier.ts
import { LLM } from '../llms';
import { Field } from '../parser';
import { MapAndReduceExtractor } from './map-and-reduce';
import { ExtractorType, FieldsResultObject } from './types';

export class FieldExtractor {
  private extractor: MapAndReduceExtractor;

  constructor(extractorType: ExtractorType, llm: LLM) {
    switch (extractorType) {
      case ExtractorType.MapAndReduce:
        this.extractor = new MapAndReduceExtractor(llm);
        break;
      default:
        throw new Error('Invalid extractor type');
    }
  }

  async extract(
    document: string,
    fields: Field[]
  ): Promise<FieldsResultObject> {
    return await this.extractor.extract(document, fields);
  }
}
