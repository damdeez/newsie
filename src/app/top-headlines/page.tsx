"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import Articles from "@/components/Articles/Articles";
import useGetTopHeadlines from "@/hooks/useGetTopHeadlines";
import Header from "@/components/Header/Header";
import { useSearch } from "@/contexts/SearchContext";

export default function TopHeadlines() {
  const { searchTerm } = useSearch();
  const { data, loading } = useGetTopHeadlines("us");

  return (
    <main className="font-sans grid items-start justify-items-center min-h-screen p-4 sm:p-8 pb-20 gap-4 sm:gap-16">
      <Header />
      <Articles
        title={searchTerm}
        articles={data?.articles}
        loading={loading}
      />
      {!loading && (
        <footer className="row-start-3 flex gap-4 sm:gap-6 flex-wrap items-center justify-center px-4">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
            href="https://www.damir.fun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SquareArrowOutUpRight size={15} /> Created by Damir 👨‍💻
          </a>
        </footer>
      )}
    </main>
  );
}
