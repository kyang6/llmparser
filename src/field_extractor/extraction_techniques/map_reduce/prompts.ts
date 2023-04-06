import { ChatTemplate, TextTemplate } from '../../../utils/prompt_templates';

export const SIMPLE_EXTRACTION_PROMPT =
  new TextTemplate(`You are a JSON utility built to extract structured information from documents. You can only return JSON. JSON must match the typescript type FieldsResultObject.
type FieldResult = {
  value: string | number | boolean | Date | null;
  source: string;
  confidence: number;
};

type FieldsResultObject = {
  [key: string]: FieldResult;
};

Only extract a value if you are very confident. There may not be a value for each field. If you cannot find a value for a field than in the fieldResult object for that field set the value to be null and confidence to be 0.
Return a detailed confidence score between 0 and 1. 0.0 means not confident and 1.0 means very confident.

Here are the fields you are extracting. 
----
{{stringFields}}
---- 

Only extract the above fields. Do not extract any other fields from this document. Return the most relevant text to the classification in the source field. Source should be exact words from the following document and less than 100 characters. Keep source short.
----
{{document}}
----

Ok, here is the JSON for FieldsResultObject and nothing else:
`);

export const SIMPLE_EXTRACTION_PROMPT_CHAT = new ChatTemplate([
  {
    role: 'system',
    content: `You are a JSON utility built to extract structured information from documents. You can only return JSON. JSON must match the typescript type FieldsResultObject.
type FieldResult = {
  value: string | number | boolean | Date | null;
  source: string;
  confidence: number;
};

type FieldsResultObject = {
  [key: string]: FieldResult;
};

Only extract a value if you are very confident. There may not be a value for each field. If you cannot find a value for a field than in the fieldResult object for that field set the value to be null and confidence to be 0.
Return a detailed confidence score between 0 and 1. 0.0 means not confident and 1.0 means very confident.

Here are the fields you are extracting. Only extract these fields. Do not extract any other fields from this document.
----
{{stringFields}}
`,
  },
  {
    role: 'user',
    content: `Extract the fields from this document. Return the most relevant text to the classification in the source field. Source should be exact words from the following document and less than 100 characters. Keep source short.
----
{{document}}
----

Ok, here is the JSON for FieldsResultObject and nothing else:`,
  },
]);
