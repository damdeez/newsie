"use client";

import { useSearch } from "@/contexts/SearchContext";
import { INewsApiResponse } from "@/types/types";
import { API_URL } from "@/utils/constants";
import { uniqueArticles } from "@/utils/helpers";
import { useState, useEffect } from "react";

export const useGetTopHeadlines = (country: string, query?: string) => {
  const [data, setData] = useState<INewsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSearchLoading } = useSearch();

  useEffect(() => {
    setLoading(true);
    setSearchLoading(true);
    setError(null);
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        const apikey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY || "";
        const params = new URLSearchParams({
          country: country,
          language: "en",
          apikey: apikey,
          ...(query && { q: query }),
        });

        const response = await fetch(`${API_URL}/news?${params.toString()}`,
          {
            signal: abortController.signal,
          }
        );
        const result = await response.json();
        if (!response.ok) {
          setError("An error occurred, please try refreshing the page.");
          return;
        }
        if (result.status !== "success") {
          setError(result.message || result.error || "An error occurred");
          return;
        }
        const uniqArticles = uniqueArticles(result.results || []);
        // Map API response to our shape without including raw results
        setData({
          status: result.status,
          totalResults: result.totalResults,
          nextPage: result.nextPage,
          articles: uniqArticles,
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, don't update state
          return;
        }
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    };

    fetchData();
    
    return () => {
      abortController.abort();
    };
  }, [country, query, setSearchLoading]);

  return { data, loading, error };
};

export default useGetTopHeadlines;
