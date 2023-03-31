import { LLMParser } from '../src';
import { Category } from '../src';

export const RESTAURANT_REVIEW =
  "State Bird Provisions in San Francisco is a culinary delight! The restaurant's namesake dish, the State Bird with Provisions, was a standout—crispy fried quail with stewed onions and lemon-garlic sauce, cooked to perfection. The Hamachi Crudo with Yuzu and Jalapeño was a refreshing treat, with thinly sliced hamachi and a zesty yuzu vinaigrette. The Sweet Corn Pancakes with Mt. Tam Cheese were light, fluffy, and perfectly balanced with rich, creamy cheese. The dim sum-style service added excitement to the dining experience. Overall, State Bird Provisions is a must-visit for food lovers seeking innovative and delicious cuisine in a warm and welcoming atmosphere.";

export const REVIEW_CATEGORIES: Category[] = [
  {
    name: 'restaurant_review',
    description: 'review of a restaurant',
    fields: [
      {
        name: 'restaurant',
        description: 'name of the restaurant',
        type: 'string',
      },
      {
        name: 'sentiment',
        description: 'is this review positive or negative',
        type: 'boolean',
      },
      {
        name: 'list_of_dishes',
        description:
          'give me a string list of all the dishes discussed in the review',
        type: 'string',
      },
    ],
  },
  {
    name: 'movie_review',
    description: 'review of a movie',
  },
];

export const SIMPLE_RESTAURANT_REVIEW =
  'I loved eating at McDonalds. It is one of the best restaurants in the world.';

export const SIMPLE_REVIEW_CATEGORIES: Category[] = [
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
];

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
