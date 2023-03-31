import { LLM, LLMModels } from '../llms';
import {
  Category,
  Field,
  LLMParserOptions,
  ParseParams,
  ParseResult,
} from './types';
import {
  ClassificationResult,
  validateClassificationJSON,
  SimpleClassifier,
  Classifier,
} from '../classifier';
import { Extractor, MapReduceExtractor } from '../field_extractor';

/**
 * The main LLMParser class. Make sure to intantiate with categories or fields and an OpenAI API key.
 * @param {string} options.apiKey OpenAI API key
 * @param {Category[]} options.categories Categories to parse
 * @param {Field[]} options.fields Fields to parse
 * @param {LLMModels} options.model Optional name of a LLM model to use
 * @returns {LLMParser} A LLMParser instance
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
   * Classifies and extracts fields from an input document (text) based on the categories or fields provided in the constructor.
   * @param {ParseParams} params The parameters for the parse operation
   * @returns {Promise<ParseResult>} The result of the parse operation
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
      const extractedFields = await this.extractor.extract(
        document,
        this.fields
      );
      return {
        fields: extractedFields,
      };
    }
    throw new Error('Either "categories" or "fields" must be supplied.');
  }
}
