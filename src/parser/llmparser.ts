import { LLM } from '../llms';
import { LLMModels, LLMModelsType } from '../llms/types';
import { Category, Field, ParseResult } from './types';
import { Classifier } from '../classifier';
import { ClassifierType } from '../classifier/classifier';

interface LLMParserParams {
  categories?: Category[];
  fields?: Field[];
  llm: LLM;
  apiKey: string;
  model: LLMModels;
  classifier: Classifier;
}

interface LLMParserOptions {
  categories?: Category[];
  fields?: Field[];
  apiKey: string;
  model?: LLMModelsType;
  classifierType?: ClassifierType;
}

export class LLMParser implements LLMParserParams {
  categories?: Category[];
  fields?: Field[];
  llm: LLM;
  model: LLMModels = LLMModels.GPT_3_5;
  apiKey: string;
  classifierType: ClassifierType = ClassifierType.Simple;
  classifier: Classifier;

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
  }

  async parse(document: string): Promise<ParseResult | undefined> {
    // if this.categories is defined, then we need to classify the document first
    // and then parse the document based on the classification result
    if (this.categories) {
      const category = await this.classifier.classify(
        document,
        this.categories
      );
      return category;
      // classify the document
      // parse the document based on the classification result
      // if category has no fields return category result directly
    } else if (this.fields) {
      // parse the document based on the fields
      return;
    }
  }
}
