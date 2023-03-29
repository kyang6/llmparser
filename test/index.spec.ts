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
  describe('parse', () => {
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
  });
});
