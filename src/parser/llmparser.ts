import { LLM, LLMModels, LLMModelsType } from '../llms';
import { Category, Field, ParseResult } from './types';
import {
  Classifier,
  ClassifierType,
  ClassificationResult,
  validateClassificationJSON,
} from '../classifier';
import { ExtractorType, FieldExtractor } from '../field-extractor';

interface LLMParserParams {
  categories?: Category[];
  fields?: Field[];
  llm: LLM;
  apiKey: string;
  model: LLMModels;
  classifier: Classifier;
  extractor: FieldExtractor;
}

interface LLMParserOptions {
  categories?: Category[];
  fields?: Field[];
  apiKey: string;
  model?: LLMModelsType;
  classifierType?: ClassifierType;
  extractorType?: ExtractorType;
}

interface ParseParams {
  document: string;
  forceClassifyAs?: string;
}

export class LLMParser implements LLMParserParams {
  categories?: Category[];
  fields?: Field[];
  llm: LLM;
  model: LLMModels = LLMModels.GPT_3_5;
  apiKey: string;
  classifierType: ClassifierType = ClassifierType.Simple;
  classifier: Classifier;
  extractorType: ExtractorType = ExtractorType.MapAndReduce;
  extractor: FieldExtractor;

  constructor(options: LLMParserOptions) {
    if (!options.categories && !options.fields) {
      throw new Error('Either categories or fields must be provided');
    }
    if (options.categories) {
      this.categories = options.categories;
    } else if (options.fields) {
      this.fields = options.fields;
    }
    this.apiKey = options.apiKey;
    this.model = (options.model as LLMModels) || this.model;
    this.llm = new LLM({
      apiKey: options.apiKey,
      modelName: options.model || this.model,
    });
    this.classifier = new Classifier(
      options.classifierType || this.classifierType,
      this.llm
    );
    this.extractor = new FieldExtractor(
      options.extractorType || this.extractorType,
      this.llm
    );
  }

  async parse({
    document,
    forceClassifyAs,
  }: ParseParams): Promise<ParseResult> {
    if (this.categories) {
      let classifiedCategory: ClassificationResult = {
        type: null,
        confidence: 0,
        source: '',
      };
      if (forceClassifyAs) {
        classifiedCategory = {
          type: forceClassifyAs,
          confidence: 1,
          source: 'forceClassifyAs',
        };
        const validClassification = validateClassificationJSON(
          classifiedCategory,
          this.categories
        );
        if (!validClassification) {
          throw new Error('Force classify type is not in categories.');
        }
      } else {
        classifiedCategory = await this.classifier.classify(
          document,
          this.categories
        );
      }

      // get fields from categories by matching classifiedCategory.name
      const fields = this.categories.find(
        category => category.name === classifiedCategory.type
      )?.fields;

      // if fields is undefined, return classifiedCategory
      if (!fields) {
        return classifiedCategory;
      }

      const extractedFields = await this.extractor.extract(document, fields);

      return {
        ...classifiedCategory,
        fields: extractedFields,
      };
    } else if (this.fields) {
      const extractedFields = await this.extractor.extract(
        document,
        this.fields
      );
      return extractedFields;
    }
    throw new Error('Either categories or Fields must be supplied.');
  }
}
