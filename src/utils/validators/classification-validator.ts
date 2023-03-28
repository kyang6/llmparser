import { ClassificationResult } from '../../classifier/types';
import { Category } from '../../parser/types';

export const validateClassificationJSON = (
  classificationResult: ClassificationResult,
  categories: Category[]
): boolean => {
  const categoryNames = categories.map(category => category.name);

  if (
    (classificationResult.type === null ||
      (typeof classificationResult.type === 'string' &&
        categoryNames.includes(classificationResult.type))) &&
    typeof classificationResult.confidence === 'number' &&
    typeof classificationResult.source === 'string'
  ) {
    return true;
  }
  return false;
};
