import { Template } from '../../../utils/prompt-template/template';
import { ChatTemplate } from '../../../utils/prompt-template/chat_template';

export const SIMPLE_CLASSIFICATION_PROMPT =
  new Template(`You are a JSON utility built to classify documents. You can only return JSON. JSON must match this typescript type
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

Classify this document. Return a source that is the most relevant to the classification. Source should be exact words from the following document. Source should be maximum length of 500 characters. Do not make up words.
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
    content: `Classify this document. Return a source that is the most relevant to the classification. Source should be exact words from the following document. Source should be maximum length of 500 characters. Do not make up words.
----
{{document}}
----

Ok, here is the JSON for ClassificationResult and nothing else:`,
  },
]);
