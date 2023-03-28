import { SimpleClassifier } from './classification_techniques/simple/simple_classifier';

export type ClassificationResult = {
  type: string | null;
  confidence: number;
  source: string;
};

export type Classifier = SimpleClassifier;
