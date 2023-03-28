import { LLM } from '../llms';
import { LLMModels } from '../llms/types';
import { Category } from '../parser/types';
import { ClassificationResult } from './types';
import {
  SIMPLE_CLASSIFICATION_PROMPT,
  SIMPLE_CLASSIFICATION_PROMPT_CHAT,
} from '../prompts';

import { smartParseDirtyJSON } from '../utils/json-validator';

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
        return category.name + ' (' + category.description + ')';
      })
      .join('/n');
  }

  async classify(
    document: string,
    categories: Category[]
  ): Promise<ClassificationResult> {
    const truncatedDocument = document.slice(0, DOCUMENT_CLASSIFICATION_LENGTH);
    const stringCategories = this._processCategories(categories);

    let prompt;
    if (this.llm.modelName === LLMModels.GPT_3_5_Turbo) {
      prompt = SIMPLE_CLASSIFICATION_PROMPT_CHAT.render({
        document: truncatedDocument,
        stringCategories,
      });
    } else {
      prompt = SIMPLE_CLASSIFICATION_PROMPT.render({
        document: truncatedDocument,
        stringCategories,
      });
    }

    const classificationResultString = await this.llm.call(prompt);

    const classificationResult = smartParseDirtyJSON(
      classificationResultString
    );
    return classificationResult as ClassificationResult;
  }
}
