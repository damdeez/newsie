"use client";

import { INewsApiArticle } from "@/types/types";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

interface ArticlesProps {
  title: string;
  articles?: INewsApiArticle[];
  loading: boolean;
}

const Articles = ({ title, articles, loading }: ArticlesProps) => {
  const pathname = usePathname();
  const isTopHeadlines = pathname === "/top-headlines";

  if (loading) {
    return (
      <p>
        <Loader2 className="animate-spin" />
      </p>
    );
  } else if (!articles || (articles.length === 0 && !loading)) {
    return <p>No articles found.</p>;
  }

  return (
    <section className="w-full max-w-6xl mx-auto items-start">
      <h2 className="text-xl font-bold mb-4">
        {isTopHeadlines
          ? "Top Headlines"
          : `Most recent articles for "${title}"`}
      </h2>
      <ul className="list-none list-inside">
        {articles.map((article, index) => (
          <li key={index} className="mb-4">
            <div className="relative group inline">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline block w-[300px] sm:w-[600px] text-wrap"
              >
                {article.title}
              </a>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              {article.source.name} | {new Date(article.publishedAt).toLocaleDateString()} by{" "}
              {article.author || "Unknown"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Articles;
