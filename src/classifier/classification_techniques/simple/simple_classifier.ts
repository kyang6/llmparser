import { LLM } from '../../../llms';
import { Category } from '../../../parser';
import { ClassificationResult } from '../../types';

import { smartParseDirtyJSON } from '../../../utils/validators';
import { validateClassificationJSON } from '../../classification_validator';

import { DOCUMENT_CLASSIFICATION_LENGTH } from './hyperparameters';
import {
  SIMPLE_CLASSIFICATION_PROMPT,
  SIMPLE_CLASSIFICATION_PROMPT_CHAT,
} from './prompts';
import { ClassifierBase } from '../../base';

export class SimpleClassifier extends ClassifierBase {
  constructor(llm: LLM) {
    super(llm);
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
    if (this.llm.isChatModel()) {
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

    let classificationResult;
    try {
      classificationResult = smartParseDirtyJSON(classificationResultString);
    } catch (e) {
      throw new Error('Error parsing document classification.');
    }
    const validClassification = validateClassificationJSON(
      classificationResult,
      categories
    );
    if (!validClassification) {
      throw new Error('Invalid classification JSON.');
    }

    return classificationResult as ClassificationResult;
  }
}
