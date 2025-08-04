"use client";

import useGetEverythingByQuery from "@/hooks/useGetEverythingByQuery";
import Image from "next/image";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Header from "@/components/Header/Header";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const tempSearchTerm = "artificial intelligence";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = createOpenAI({
  apiKey: apiKey,
});

// Function to format text with better bullet point styling
const formatText = (text: string) => {
  return text.split("\n").map((line, index) => {
    // Check if line starts with a bullet point
    if (line.trim().startsWith("•")) {
      return (
        <div key={index} className="flex items-start gap-2 mb-2">
          <span className="text-blue-500 font-bold mt-1">•</span>
          <span className="flex-1">{line.trim().substring(1).trim()}</span>
        </div>
      );
    }
    // Regular line
    return line.trim() ? (
      <p key={index} className="mb-2">
        {line}
      </p>
    ) : (
      <br key={index} />
    );
  });
};

function AiSummary() {
  const [searchTerm, setSearchTerm] = useState(tempSearchTerm);
  const [text, setText] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data, loading } = useGetEverythingByQuery(debouncedSearchTerm);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const { text: aiText } = await generateText({
        model: openai("o3-mini"),
        prompt: `Generate a summary for the following articles, be concise and easy to understand while having a friendly tone towards the user who is reading it: ${data?.articles
          .map((article) => article.title)
          .join(", ")}`,
      });
      setText(aiText);
    } catch (error) {
      console.error("Error generating summary:", error);
      setText("An error occurred while generating the summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  console.info(">>> text:", text);

  return (
    <main className="font-sans grid items-start justify-items-center min-h-screen p-2 sm:p-8 pb-20 gap-4 sm:gap-16">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
      />
      <div>
        <h2 className="text-lg font-semibold mb-2">
          AI Summary 🤖 for {searchTerm}
        </h2>
        <Button
          className="flex align-middle justify-center w-full sm:w-[180px] h-[35px] hover:cursor-pointer"
          variant="outline"
          onClick={handleGenerateSummary}
          disabled={loading || loadingSummary}
        >
          Generate Summary
          {loadingSummary ? <Loader2 className="animate-spin ml-2" /> : null}
        </Button>
        {text && (
          <div className="w-lg mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p>{formatText(text)}</p>
          </div>
        )}
      </div>
      {!loading && (
        <footer className="row-start-3 flex gap-4 sm:gap-6 flex-wrap items-center justify-center px-4">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
            href="https://www.damir.fun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Created by Damir →
          </a>
        </footer>
      )}
    </main>
  );
}

export default AiSummary;
