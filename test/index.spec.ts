import { LLMParser } from '../src';

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
    it('should successfully parse a document with only categories', async () => {
      console.log(process.env.OPENAI_API_KEY);
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

    it('should successfully parse a document with both categories and fields', async () => {
      const parser = new LLMParser({
        apiKey: process.env.OPENAI_API_KEY as string,
        categories: [
          {
            name: 'review',
            description: 'restaurant review',
            fields: [
              {
                name: 'restaurant_name',
                description: 'name of the restaurant being reviewed',
                type: 'string',
              },
            ],
          },
        ],
      });
      const result = await parser.parse({
        document:
          'I loved eating at McDonalds. It is one of the best restaurants in the world.',
      });
      expect(result).toBeDefined();
      expect(result.type).toEqual('review');
      expect(result.fields).toBeDefined();
      expect(result.fields?.restaurant_name).toBeDefined();
      expect(result.fields?.restaurant_name.value).toEqual('McDonalds');
    });
  });
});
