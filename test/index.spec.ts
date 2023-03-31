import { LLMParser } from '../src';
import {
  RESTAURANT_REVIEW,
  REVIEW_CATEGORIES,
  SIMPLE_RESTAURANT_REVIEW,
  SIMPLE_REVIEW_CATEGORIES,
} from './test_docs';

describe('LLMParser', () => {
  describe('instantiation', () => {
    it('should successfully create a new instance of LLMParser with only categories', () => {
      const parser = new LLMParser({
        apiKey: '1234',
        categories: [
          {
            name: 'MSA',
            description: 'Master Service Agreement',
          },
        ],
      });
      expect(parser).toBeDefined();
    });

    it('should successfully create a new instance of LLMParser with only fields', () => {
      const parser = new LLMParser({
        apiKey: '1234',
        fields: [
          {
            name: 'MSA',
            description: 'Master Service Agreement',
            type: 'string',
          },
        ],
      });
      expect(parser).toBeDefined();
    });

    it('should throw an error if neither categories nor fields are provided', () => {
      const parser = () =>
        new LLMParser({
          apiKey: '1234',
        });
      expect(parser).toThrowError();
    });

    it('should throw an error if both categories and fields are provided', () => {
      const parser = () =>
        new LLMParser({
          apiKey: '1234',
          categories: [
            {
              name: 'MSA',
              description: 'Master Service Agreement',
            },
          ],
          fields: [
            {
              name: 'MSA',
              description: 'Master Service Agreement',
              type: 'string',
            },
          ],
        });
      expect(parser).toThrowError();
    });
  });
  describe('parsing', () => {
    it('should successfully categorize a document with only categories', async () => {
      const parser = new LLMParser({
        apiKey: process.env.OPENAI_API_KEY as string,
        categories: [
          {
            name: 'a',
            description: 'the document includes the letter a',
          },
        ],
      });
      const result = await parser.parse({
        document: 'a',
      });
      expect(result).toBeDefined();
      expect(result.type).toEqual('a');
    });

    it('should successfully parse a document with only fields', async () => {
      const parser = new LLMParser({
        apiKey: process.env.OPENAI_API_KEY as string,
        fields: [
          {
            name: 'name',
            description: 'full name of the creator of this document',
            type: 'string',
          },
        ],
      });
      const result = await parser.parse({
        document: 'I am Kevin Yang, the creator of this document',
      });
      expect(result).toBeDefined();
      expect(result.fields).toBeDefined();
      expect(result.fields?.name).toBeDefined();
      expect(result.fields?.name.value).toEqual('Kevin Yang');
    });

    it('should successfully categorize and parse a document with categories and fields', async () => {
      const parser = new LLMParser({
        apiKey: process.env.OPENAI_API_KEY as string,
        categories: SIMPLE_REVIEW_CATEGORIES,
      });
      const result = await parser.parse({
        document: SIMPLE_RESTAURANT_REVIEW,
      });
      expect(result).toBeDefined();
      expect(result.type).toEqual('review');
      expect(result.fields).toBeDefined();
      expect(result.fields?.restaurant_name).toBeDefined();
      expect(result.fields?.restaurant_name.value).toEqual('McDonalds');
    });
  });

  describe('map-reduce-extractor', () => {
    it('should successfully extract fields from a document', async () => {
      const parser = new LLMParser({
        apiKey: process.env.OPENAI_API_KEY as string,
        categories: REVIEW_CATEGORIES,
      });
      const result = await parser.parse({
        document: RESTAURANT_REVIEW,
      });
      expect(result).toBeDefined();
      expect(result.fields).toBeDefined();
      expect(result.fields?.restaurant).toBeDefined();
      expect(result.fields?.restaurant.value).toEqual('State Bird Provisions');
    }, 30000);
  });
});
