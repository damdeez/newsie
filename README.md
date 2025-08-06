# Newsie 📰 (just another News app) 🤘

Uses the News API (https://newsapi.org/) to bring you the latest News from around the world. It also uses the `ai` SDK to generate a summary of the news using an OpenAI LLM.

## Getting Started 🚀

First, create a `.env` file at the root of the project and add in your News API and OpenAI keys

```
NEXT_PUBLIC_NEWS_API_KEY=<API_KEY>
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

## Steps Taken

- Design Decisions: I built the news site using a component-based React structure with custom hooks to handle API calls and utility functions. For state management, I used React Context to share search data across components (I could've stuck with useEffect but wanted to minimize on prop drilling), and integrated React Hook Form with Zod for form validation. The styling approach centered around TailwindCSS to keep the design somewhat maintainable. I haven't used TailwindCSS much, so this was a learning experience for me. This is why one of the key challenges I talk about below was to get responsive design right.

- Key Challenges: The biggest challenge was getting the responsive design right - making sure the layout worked smoothly across different screen sizes while maintaining good user experience. This meant carefully managing component visibility, adjusting layouts between mobile and desktop views, and handling dynamic content like search results that needed to adapt to various viewport sizes. Testing also proved tricky, especially when mocking browser APIs and async operations, which required finding creative solutions to simulate real-world scenarios in the test environment (thanks Claude).
