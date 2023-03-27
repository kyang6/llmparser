# llmparser

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Classify and extract structured data from anywhere

## Install

```bash
npm install llmparser
```

## Quick Usage

```ts
import { LLMParser, PDFLoader } from llmparser;

const categories = [
  {
    name: "MSA",
    description: "Legal MSA document", // instruction for LLM
    fields: [
      {
        name: "counterparty",
        description: "counterparty of the MSA agreement",
        type: "string"
      }
    ]
  },
  {
    name: "NDA",
    description: "Non disclosure agreement",
    fields: [
      {
        name: "counterparty",
        description: "who we are signing the NDA with",
        type: "string"
      },
      {
        name: "mutual",
        description: "is this a mutual NDA",
        type: "boolean"
      }
    ]
  }
]

const parser = new LLMParser({
  categories,
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo", // or gpt-4
})

/* if you don't want to categorize and only extract fields
const parser = new LLMParser({
  fields,
  apiKey: process.env.OPENAI_API_KEY
})
*/


const loader = new PDFLoader(); // instantiate class because it can inherit
const document = await loader.load("src/examples/nda.pdf"); // or blob

// document is just a plain text blob
const results = await parser.parse(document);
// if document > context length than we split into chunks and iterate

console.log(results);
{
  type: "NDA",
  confidence: 0.90,
  source: "Non disclosure agreement",
  fields: {
    counterparty: {
      value: "Series Financial",
      source: "... Series Financial ...",
      confidence: 0.92
    },
    mutual: {
      value: true,
      source: "Mutual NDA",
      confidence: 0.84
    }
  }
}
```

[build-img]:https://github.com/ryansonshine/typescript-npm-package-template/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/ryansonshine/typescript-npm-package-template/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/typescript-npm-package-template
[downloads-url]:https://www.npmtrends.com/typescript-npm-package-template
[npm-img]:https://img.shields.io/npm/v/typescript-npm-package-template
[npm-url]:https://www.npmjs.com/package/typescript-npm-package-template
[issues-img]:https://img.shields.io/github/issues/ryansonshine/typescript-npm-package-template
[issues-url]:https://github.com/ryansonshine/typescript-npm-package-template/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/typescript-npm-package-template/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/typescript-npm-package-template
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
