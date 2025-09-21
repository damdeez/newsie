# Newsie 📰 (just another News app) 🤘

[Check out a demo](https://newsie-puce.vercel.app/)

Uses the NewsData.io API (https://newsdata.io) to bring you the latest News from around the world. It also uses the `ai` SDK to generate a summary of the news using an OpenAI LLM.

## Getting Started 🚀

First, create a `.env` file at the root of the project and add in your NewsData.io API and OpenAI keys

```
NEXT_PUBLIC_NEWSDATA_API_KEY=<API_KEY>
NEXT_PUBLIC_OPENAI_API_KEY=<API_KEY>
```

Second, install the dependencies and run the development server:

```bash
npm i && npm run dev
# or
yarn i && yarn dev
# or
pnpm i && pnpm dev
# or
bun i && bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the rockin' news around the world.
