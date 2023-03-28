export type ClassificationResult = {
  type: string | null;
  confidence: number;
  source: string;
};

export enum ClassifierType {
  Simple = 'simple',
}
