import { LLM } from '../../../llms';
import { Field } from '../../../llmparser';
import { FieldsResultObject, PossibleFieldValues } from '../../types';
import {
  crudeTokenizer,
  tokenLengthToCharLength,
} from '../../../utils/tokenizer';
import { validateExtractedFields } from '../../extraction_validator';

import { ChatTemplate, TextTemplate } from '../../../utils/prompt_templates';

import {
  CHUNK_BUFFER_IN_TOKENS,
  DOCUMENT_CHUNK_OVERLAP,
} from './hyperparameters';
import { smartParseDirtyJSON } from '../../../utils/validators';

import { promiseAllRateLimited } from '../../../utils/rate_limit';
import { FieldExtractorBase } from '../../base';

import {
  SIMPLE_EXTRACTION_PROMPT,
  SIMPLE_EXTRACTION_PROMPT_CHAT,
} from './prompts';

export class MapReduceExtractor extends FieldExtractorBase {
  constructor(llm: LLM) {
    super(llm);
  }

  _chunkDocument(
    document: string,
    chunkSize: number,
    chunkOverlap: number
  ): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < document.length; i += chunkSize - chunkOverlap) {
      chunks.push(document.slice(i, i + chunkSize));
    }
    return chunks;
  }

  _processFields(fields: Field[]): string {
    // convert into a string that can be used as a prompt
    return fields
      .map(field => {
        return `${field.name} (${field.description}): typescript type ${field.type}`;
      })
      .join('\n');
  }

  // returns length of chunk in characters
  _calculateChunkLength(
    stringFields: string,
    promptLengthInTokens: number
  ): number {
    return tokenLengthToCharLength(
      this.llm.getContextSize() -
        crudeTokenizer(stringFields) -
        promptLengthInTokens -
        CHUNK_BUFFER_IN_TOKENS
    );
  }

  _extractFieldsForChunk(
    chunk: string,
    stringFields: string,
    promptTemplate: TextTemplate | ChatTemplate
  ): Promise<FieldsResultObject> {
    return new Promise((resolve, reject) => {
      const prompt = promptTemplate.render({
        document: chunk,
        stringFields,
      });

      this.llm
        .call(prompt)
        .then((result: string) => {
          try {
            const extractedFieldsForChunk: FieldsResultObject =
              smartParseDirtyJSON(result);
            resolve(extractedFieldsForChunk);
          } catch (e) {
            resolve({});
          }
        })
        .catch((err: string) => {
          console.log(err);
          reject(err);
        });
    });
  }

  _mergeFieldsForChunks(
    extractedFieldsForChunks: FieldsResultObject[],
    fields: Field[]
  ): FieldsResultObject {
    const fieldValues: {
      [key: string]: PossibleFieldValues[];
    } = {};
    const confidenceScores: { [key: string]: number[] } = {};
    const sources: { [key: string]: string[] } = {};

    // Initialize empty arrays for each field name to hold values, confidence scores, and sources.
    for (const field of fields) {
      fieldValues[field.name] = [];
      confidenceScores[field.name] = [];
      sources[field.name] = [];
    }

    // Loop through each chunk of extracted fields.
    for (const extractedFields of extractedFieldsForChunks) {
      // Loop through each field in the list of fields.
      for (const field of fields) {
        // If the current field was not extracted in the current chunk, skip it.
        if (!(field.name in extractedFields)) continue;

        const extractedField = extractedFields[field.name];
        if (extractedField) {
          // If a value was extracted for the current field in the current chunk, try to convert it to the correct type.
          let value: any = extractedField.value;
          if (value !== null) {
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
              // If the conversion fails, set the value to null.
              value = null;
            }
          }

          // Add the value, confidence score, and source to the arrays for the current field.
          fieldValues[field.name].push(value);
          confidenceScores[field.name].push(extractedField.confidence);
          sources[field.name].push(extractedField.source);
        }
      }
    }

    const result: FieldsResultObject = {};

    // Loop through each field and choose the most common value (or highest confidence score if there is a tie).
    for (const field of fields) {
      const values = fieldValues[field.name];
      const confidence = confidenceScores[field.name];
      const source = sources[field.name];

      if (values.length > 0) {
        let highestConfidence = -Infinity;
        let valueWithHighestConfidence: PossibleFieldValues = null;

        for (let i = 0; i < values.length; i++) {
          const currentValue = values[i];
          const currentConfidence = confidence[i];
          if (currentValue !== null && currentConfidence > highestConfidence) {
            highestConfidence = currentConfidence;
            valueWithHighestConfidence = currentValue;
          }
        }

        // Set the result for the current field to the value with the highest confidence.
        result[field.name] = {
          value: valueWithHighestConfidence,
          source: source[0] || '',
          confidence: highestConfidence,
        };
      } else {
        // If there are no values for the current field, set the result to null.
        result[field.name] = {
          value: null,
          source: '',
          confidence: 0,
        };
      }
    }

    return result;
  }

  async extract(
    document: string,
    fields: Field[]
  ): Promise<FieldsResultObject> {
    const stringFields = this._processFields(fields);

    let promptTemplate: TextTemplate | ChatTemplate;
    if (this.llm.isChatModel()) {
      promptTemplate = SIMPLE_EXTRACTION_PROMPT_CHAT;
    } else {
      promptTemplate = SIMPLE_EXTRACTION_PROMPT;
    }

    const chunkLength = this._calculateChunkLength(
      stringFields,
      promptTemplate.numTokens()
    );

    if (chunkLength < 0) {
      throw new Error(
        'Chunk length is negative. This is likely due to the number of fields being too large.'
      );
    }

    const docChunks = this._chunkDocument(
      document,
      chunkLength,
      DOCUMENT_CHUNK_OVERLAP
    );

    const extractedFieldsForChunks = await promiseAllRateLimited(
      docChunks.map(chunk => {
        return () =>
          this._extractFieldsForChunk(chunk, stringFields, promptTemplate);
      }),
      100,
      5
    );

    const mergedFields = this._mergeFieldsForChunks(
      extractedFieldsForChunks,
      fields
    );

    const validExtraction = validateExtractedFields(mergedFields, fields);
    if (!validExtraction) {
      throw new Error('Invalid extraction.');
    }

    return mergedFields;
  }
}
