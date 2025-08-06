"use client";

import { useState } from "react";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { INewsApiArticle } from "@/types/types";
import { getTimeOfDayGreeting } from "@/utils/helpers";
import { usePathname } from "next/navigation";

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
          <span className="text-blue-500 font-bold">•</span>
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

interface SummaryProps {
  articles?: INewsApiArticle[];
  loading: boolean;
}

const Summary = ({ articles, loading }: SummaryProps) => {
  const [aiResponse, setAiResponse] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const { searchTerm, searchLoading } = useSearch();
  const pathname = usePathname();
  const isOnTopHeadlines = pathname === "/top-headlines";

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      // TODO: decide if we want to use generateText or streamText
      const prompt = isOnTopHeadlines
        ? `Generate a summary for the following articles, be concise and easy to understand while having a friendly-tone towards the user who is reading your response: ${articles
            ?.map((article) => article.description)
            .join(", ")}`
        : `Generate a summary for the following articles based on a search query ${searchTerm}, be concise and easy to understand while having a friendly-tone towards the user who is reading your response: ${articles
            ?.map((article) => article.description)
            .join(", ")}`;
      const { textStream: aiText } = streamText({
        model: openai("o3-mini"),
        prompt: prompt,
      });
      for await (const delta of aiText) {
        // TODO: probably need to handle this better for performance reasons
        setAiResponse((prev) => prev + delta);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setAiResponse("An error occurred while generating the summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <section className="flex w-full flex-col p-4 max-h-96 md:h-min bg-gray-100 dark:bg-gray-800 rounded-b-none md:rounded-b-lg rounded-lg fixed bottom-0 left-0 right-0 sm:sticky sm:bottom-16 z-10 overflow-y-auto">
      <h2 className="text-md sm:text-lg font-semibold mb-4 sm:mb-2">
        {!aiResponse
          ? `${getTimeOfDayGreeting()} 🤖 ${
              isOnTopHeadlines
                ? "AI summary of top headlines will be generated here."
                : `AI summary of articles on "${searchTerm}" will be generated here.`
            }`
          : `Enjoy your summary of recent news on ${
              isOnTopHeadlines ? "top headlines" : `"${searchTerm}"`
            }.`}
      </h2>
      {!aiResponse && (
        <Button
          className="flex bg-transparent align-middle justify-center w-full !min-h-[40px] !max-h-[40px] sm:!min-h-[35px] sm:!max-h-[35px] hover:cursor-pointer"
          variant="outline"
          onClick={handleGenerateSummary}
          disabled={searchLoading || loadingSummary || aiResponse.length > 0}
        >
          {loadingSummary ? "Generating Summary" : "Generate Summary"}
          {loadingSummary ? <Loader2 className="animate-spin ml-2" /> : null}
        </Button>
      )}
      {aiResponse && (
        <div
          className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg overflow-y-auto"
          data-testid="ai-summary-response"
        >
          {formatText(aiResponse)}
        </div>
      )}
    </section>
  );
};

export default Summary;
