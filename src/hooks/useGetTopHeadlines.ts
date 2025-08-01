"use client";

import { INewsApiResponse } from "@/types/types";
import { API_URL } from "@/utils/constants";
import { uniqueArticles } from "@/utils/helpers";
import { useState, useEffect } from "react";

/**
 * Custom hook to fetch top headlines from the News API.
 * @param country - The country code for which to fetch headlines (e.g., 'us', 'gb').
 */
export const useGetTopHeadlines = (country: string) => {
  const [data, setData] = useState<INewsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/top-headlines?country=${country}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        if (!response.ok) {
          setError("An error occurred, please try refreshing the page.");
        }
        const result = await response.json();
        if (result.status !== "ok") {
          setError(result.error || "An error occurred");
        }
        const uniqArticles = uniqueArticles(result.articles);
        setData({ ...result, articles: uniqArticles });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country]);

  return { data, loading, error };
};

export default useGetTopHeadlines;
