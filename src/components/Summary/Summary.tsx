import { useState } from "react";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { INewsApiArticle } from "@/types/types";

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
}

const Summary = ({ articles }: SummaryProps) => {
  const [aiResponse, setAiResponse] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const { searchTerm, searchLoading } = useSearch();

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const { text: aiText } = await generateText({
        model: openai("o3-mini"),
        prompt: `Generate a summary for the following articles based on a search query ${searchTerm}, be concise and easy to understand while having a friendly-tone towards the user who is reading your response: ${articles
          ?.map((article) => article.description)
          .join(", ")}`,
      });
      setAiResponse(aiText);
    } catch (error) {
      console.error("Error generating summary:", error);
      setAiResponse("An error occurred while generating the summary.");
    } finally {
      setLoadingSummary(false);
    }
  };
  return (
    <section className="flex w-full flex-col p-4 max-h-min bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">
        AI Summary 🤖 of recent news on &quot;{searchTerm}&quot;
      </h2>
      {!aiResponse && (
        <Button
          className="flex bg-transparent align-middle justify-center w-full sm:w-[200px] h-[35px] hover:cursor-pointer"
          variant="outline"
          onClick={handleGenerateSummary}
          disabled={searchLoading || loadingSummary || aiResponse.length > 0}
        >
          {loadingSummary ? "Generating Summary" : "Generate Summary"}
          {loadingSummary ? <Loader2 className="animate-spin ml-2" /> : null}
        </Button>
      )}
      {aiResponse && (
        <div className="w-lg mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
          <p>{formatText(aiResponse)}</p>
        </div>
      )}
    </section>
  );
};

export default Summary;
