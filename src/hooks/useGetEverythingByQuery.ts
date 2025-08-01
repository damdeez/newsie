"use client";

import { INewsApiResponse } from "@/types/types";
import { useState, useEffect } from "react";
import { uniqueArticles } from "@/utils/helpers";
import { API_URL } from "@/utils/constants";

export const useGetEverythingByQuery = (query: string) => {
  const [data, setData] = useState<INewsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/everything?q=${query}&language=en&from=2025-07-01&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
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
      }
    };

    fetchData();
  }, [query]);

  return { data, loading, error };
};

export default useGetEverythingByQuery;
