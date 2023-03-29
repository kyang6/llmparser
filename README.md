# 🏷 LLMParser

LLMParser is a simple and flexible tool to classify and extract structured information from text.

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Issues][issues-img]][issues-url]

## Install

```bash
npm install llmparser
```

## Usage

Quick note: this library is meant for server-side usage, as using it in client-side browser code will expose your secret API key. Go [here](https://platform.openai.com/docs/api-reference/authentication) to get an OpenAI API key.

```ts
import { LLMParser } from llmparser;

const categories = [
  {
    name: "MSA",
    description: "Master service agreement", // instruction for LLM
  },
  {
    name: "NDA",
    description: "Non disclosure agreement",
    fields: [
      {
        name: "effective_date",
        description: "effective date or start date",
        type: "string"
      },
      {
        name: "company",
        description: "name of the company",
        type: "string"
      },
      {
        name: "counterparty",
        description: "name of the counterparty",
        type: "string"
      }
    ]
  }
]

const parser = new LLMParser({
  categories,
  apiKey: process.env.OPENAI_API_KEY
})

const nda = // load NDA from PDF
const results = await parser.parse(nda);
{
  "type": "NDA",
  "confidence": 1,
  "source": "This is a Mutual Non-Disclosure Agreement (this “Agreement”), effective as of the date stated below (the “Effective Date”), between Technology Research Corporation, a Florida corporation (the “Company”), and Kevin Yang (the “Counterparty”).",
  "fields": {
      "effective_date": {
          "value": "2022-01-11T06:00:00.000Z",
          "source": "Effective date of January 11, 2022",
          "confidence": 1
      },
      "company": {
          "value": "Technology Research Corporation",
          "source": "between Technology Research Corporation, a Florida corporation",
          "confidence": 0.9
      },
      "counterparty": {
          "value": "Kevin Yang",
          "source": "and Kevin Yang (the “Counterparty”)",
          "confidence": 0.9
      }
  }
}
```

[build-img]:https://github.com/kyang6/llmparser/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/kyang6/llmparser/actions/workflows/release.yml
[npm-img]:https://img.shields.io/npm/v/llmparser
[npm-url]:https://www.npmjs.com/package/llmparser
[issues-img]:https://img.shields.io/github/issues/ryansonshine/llmparser
[issues-url]:https://github.com/kyang6/llmparser/issues
