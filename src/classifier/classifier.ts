// classifier.ts
import { LLM } from '../llms';
import { Category } from '../parser';
import { SimpleClassifier } from './simple';
import { ClassificationResult, ClassifierType } from './types';

export class Classifier {
  private classifier: SimpleClassifier;

  constructor(classifierType: ClassifierType, llm: LLM) {
    switch (classifierType) {
      case ClassifierType.Simple:
        this.classifier = new SimpleClassifier(llm);
        break;
      default:
        throw new Error('Invalid classifier type');
    }
  }

  async classify(
    document: string,
    categories: Category[]
  ): Promise<ClassificationResult> {
    return await this.classifier.classify(document, categories);
  }
}
