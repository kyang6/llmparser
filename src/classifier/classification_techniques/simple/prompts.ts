import { ChatTemplate, TextTemplate } from '../../../utils/prompt_templates';

export const SIMPLE_CLASSIFICATION_PROMPT =
  new TextTemplate(`You are a JSON utility built to classify documents. You can only return JSON. JSON must match this typescript type
type ClassificationResult = {
  "type": string | null;
  "confidence": number; // between 0 and 1
  "source": string;
};

Only pick a type if you are very confident. There may not be a type. If there is no type that is relevant than you should return the type null.
Return a confidence of 0 if you are not confident. Return a confidence of 1 if you are very confident.

Here are the categories
----
{{stringCategories}}
----

Classify this document. Return the most relevant text to the classification in the source field. Source should be exact words from the following document and less than 200 characters. Keep source short.
----
{{document}}
----

Ok, here is the JSON for ClassificationResult and nothing else:
`);

export const SIMPLE_CLASSIFICATION_PROMPT_CHAT = new ChatTemplate([
  {
    role: 'system',
    content: `You are a JSON utility built to classify documents. You can only return JSON. JSON must match this typescript type
type ClassificationResult = {
  "type": string | null;
  "confidence": number; // between 0 and 1
  "source": string;
};

Only pick a type if you are very confident. There may not be a type. If there is no type that is relevant than you should return the type null.
Return a confidence of 0 if you are not confident. Return a confidence of 1 if you are very confident.

Here are the categories
----
{{stringCategories}}
`,
  },
  {
    role: 'user',
    content: `Classify this document. Return the most relevant text to the classification in the source field. Source should be exact words from the following document and less than 200 characters. Keep source short.
----
{{document}}
----

Ok, here is the JSON for ClassificationResult and nothing else:`,
  },
]);
