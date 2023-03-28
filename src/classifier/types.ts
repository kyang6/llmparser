import { SimpleClassifier } from './classification-techniques/simple/simple';

export type ClassificationResult = {
  type: string | null;
  confidence: number;
  source: string;
};

export type Classifier = SimpleClassifier;
