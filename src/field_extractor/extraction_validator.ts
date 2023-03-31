import { FieldsResultObject } from './types';
import { Field } from '../parser';

export const validateExtractedFields = (
  extractedFields: FieldsResultObject,
  fields: Field[]
): boolean => {
  for (const field of fields) {
    if (!(field.name in extractedFields)) continue;

    const extractedField = extractedFields[field.name];
    if (extractedField) {
      let value: any = extractedField.value;
      try {
        switch (field.type) {
          case 'number':
            value = Number(value);
            break;
          case 'boolean':
            value = Boolean(value);
            break;
          case 'date':
            value = new Date(value);
            break;
        }
      } catch (err) {
        return false;
      }
    }
  }

  return true;
};
