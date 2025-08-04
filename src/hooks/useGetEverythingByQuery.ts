"use client";

import { INewsApiResponse } from "@/types/types";
import { useState, useEffect } from "react";
import { oneMonthAgo, uniqueArticles } from "@/utils/helpers";
import { API_URL } from "@/utils/constants";
import { useSearch } from "@/contexts/SearchContext";

export const useGetEverythingByQuery = (query: string) => {
  const [data, setData] = useState<INewsApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSearchLoading } = useSearch();

  useEffect(() => {
    setLoading(true);
    setSearchLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/everything?q=${query}&language=en&from=${oneMonthAgo}&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        if (!response.ok) {
          setError("An error occurred, please try refreshing the page.");
        }
        const result = await response.json();
        if (result.status !== "ok") {
          setError(result.error || "An error occurred");
        }

        // Check for same title articles and then filter them out
        const uniqArticles = uniqueArticles(result.articles);
        setData({ ...result, articles: uniqArticles });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    };

    fetchData();
  }, [query, setSearchLoading]);

  return { data, loading, error };
};

export default useGetEverythingByQuery;
