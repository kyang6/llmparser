import { LLM, LLMModels, LLMModelsType } from '../llms';
import { Category, Field, ParseResult } from './types';
import {
  ClassificationResult,
  validateClassificationJSON,
  SimpleClassifier,
  Classifier,
} from '../classifier';
import { Extractor, MapReduceExtractor } from '../field_extractor';

interface LLMParserOptions {
  apiKey: string;
  categories?: Category[];
  fields?: Field[];
  model?: LLMModelsType;
}

interface ParseParams {
  document: string;
  forceClassifyAs?: string;
}

/*
 * This is the main class for LLMParser.
 */
export class LLMParser {
  private categories?: Category[];
  private fields?: Field[];
  private llm: LLM;
  private model: LLMModels = LLMModels.GPT_3_5_Turbo;
  private classifier: Classifier;
  private extractor: Extractor;

  constructor(options: LLMParserOptions) {
    if (!options.categories && !options.fields) {
      throw new Error(
        'Either "categories" or "fields" must be provided in the options.'
      );
    }
    if (options.categories && options.fields) {
      throw new Error(
        'Only one of "categories" or "fields" can be provided in the options.'
      );
    }
    this.categories = options.categories;
    this.fields = options.fields;
    this.model = (options.model as LLMModels) || this.model;
    this.llm = new LLM(options.apiKey, this.model);
    this.classifier = new SimpleClassifier(this.llm);
    this.extractor = new MapReduceExtractor(this.llm);
  }

  /**
   * Parses the input document and returns the classification and extraction results.
   * @param {ParseParams} params - The parameters for the parse operation.
   * @returns {Promise<ParseResult>} - The result of the parse operation.
   */
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
          throw new Error(
            'The "forceClassifyAs" type is not in the defined categories.'
          );
        }
      } else {
        classifiedCategory = await this.classifier.classify(
          document,
          this.categories
        );
      }

      const fields = this.categories.find(
        category => category.name === classifiedCategory.type
      )?.fields;

      if (!fields) {
        return classifiedCategory;
      }

      const extractedFields = await this.extractor.extract(document, fields);
      return {
        ...classifiedCategory,
        fields: extractedFields,
      };
    } else if (this.fields) {
      return await this.extractor.extract(document, this.fields);
    }
    throw new Error('Either "categories" or "fields" must be supplied.');
  }
}
