import { LLM } from '../llms';
import { LLMModels } from '../llms/types';
import { Category } from '../parser/types';
import { ClassificationResult } from './types';
import {
  SIMPLE_CLASSIFICATION_PROMPT,
  SIMPLE_CLASSIFICATION_PROMPT_CHAT,
} from '../prompts';

import { DOCUMENT_CLASSIFICATION_LENGTH } from './hyperparameters';

export class SimpleClassifier {
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  _processCategories(categories: Category[]): string {
    // remove fields from categories
    return categories
      .map((category: Category) => {
        return category.name + ': ' + category.description;
      })
      .join(' ');
  }

  async classify(
    document: string,
    categories: Category[]
  ): Promise<ClassificationResult> {
    let classificationResultString: string;

    if (this.llm.modelName === LLMModels.GPT_3_5_Turbo) {
      const truncatedDocument = document.slice(
        0,
        DOCUMENT_CLASSIFICATION_LENGTH
      );
      const stringCategories = this._processCategories(categories);
      const prompt = SIMPLE_CLASSIFICATION_PROMPT_CHAT.render({
        document: truncatedDocument,
        stringCategories,
      });

      classificationResultString = await this.llm.call(prompt);
    } else {
      const truncatedDocument = document.slice(
        0,
        DOCUMENT_CLASSIFICATION_LENGTH
      );
      const stringCategories = this._processCategories(categories);
      const prompt = SIMPLE_CLASSIFICATION_PROMPT.render({
        document: truncatedDocument,
        stringCategories,
      });

      classificationResultString = await this.llm.call(prompt);
    }

    console.log(classificationResultString);

    console.log('just console logged');
    const classificationResult = JSON.parse(classificationResultString);
    return classificationResult as ClassificationResult;
  }
}
