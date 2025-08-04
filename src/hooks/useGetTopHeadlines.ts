"use client";

import { useSearch } from "@/contexts/SearchContext";
import { INewsApiResponse } from "@/types/types";
import { API_URL } from "@/utils/constants";
import { uniqueArticles } from "@/utils/helpers";
import { useState, useEffect } from "react";

export const useGetTopHeadlines = (country: string, query?: string) => {
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
          `${API_URL}/top-headlines?country=${country}&?q=${query}`,
          {
            headers: {
              "X-Api-Key": process.env.NEXT_PUBLIC_NEWS_API_KEY || "",
            },
          }
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
        setSearchLoading(false);
      }
    };

    fetchData();
  }, [country, query, setSearchLoading]);

  return { data, loading, error };
};

export default useGetTopHeadlines;
