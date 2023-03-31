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
