import { renderHook, waitFor } from "@testing-library/react";
import { useGetTopHeadlines } from "./useGetTopHeadlines";
import { INewsApiResponse, INewsApiArticle } from "../types/types";
import * as helpers from "../utils/helpers";

// Mock the SearchContext
const mockSetSearchLoading = jest.fn();
jest.mock("../contexts/SearchContext", () => ({
  useSearch: () => ({
    setSearchLoading: mockSetSearchLoading,
  }),
}));

// Mock environment variables
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_NEWS_API_KEY: "test-api-key",
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Import actual helpers since we're now importing uniqueArticles directly
jest.mock("../utils/helpers", () => {
  const actual = jest.requireActual("../utils/helpers");
  return {
    ...actual,
  };
});

jest.mock("../utils/constants", () => ({
  API_URL: "https://newsapi.org/v2",
}));

const mockArticles: INewsApiArticle[] = [
  {
    source: { id: "test", name: "Test Source" },
    author: "Jane Doe",
    title: "Breaking News",
    description: "Important news description",
    url: "https://example.com/breaking-news",
    urlToImage: "https://example.com/breaking.jpg",
    publishedAt: "2023-01-01T12:00:00Z",
    content: "Breaking news content",
  },
];

const mockSuccessResponse: INewsApiResponse = {
  status: "ok",
  totalResults: 1,
  articles: mockArticles,
};

global.fetch = jest.fn();

describe("useGetTopHeadlines", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it("should return initial state", () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fetch top headlines successfully without query", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    expect(result.current.loading).toBe(true);
    expect(mockSetSearchLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockSuccessResponse);
    expect(result.current.error).toBeNull();
    expect(mockSetSearchLoading).toHaveBeenCalledWith(false);

    // Verify correct API call without query
    expect(fetch).toHaveBeenCalledWith(
      "https://newsapi.org/v2/top-headlines?country=us",
      {
        headers: {
          "X-Api-Key": "test-api-key",
        },
      }
    );
  });

  it("should fetch top headlines successfully with query", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us", "bitcoin"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockSuccessResponse);
    expect(result.current.error).toBeNull();

    // Verify correct API call with query
    expect(fetch).toHaveBeenCalledWith(
      "https://newsapi.org/v2/top-headlines?country=us&q=bitcoin",
      {
        headers: {
          "X-Api-Key": "test-api-key",
        },
      }
    );
  });

  it("should handle missing API key", async () => {
    // Temporarily remove API key
    const originalKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    delete process.env.NEXT_PUBLIC_NEWS_API_KEY;

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify API call was made with empty string for missing key
    expect(fetch).toHaveBeenCalledWith(
      "https://newsapi.org/v2/top-headlines?country=us",
      {
        headers: {
          "X-Api-Key": "",
        },
      }
    );

    // Restore API key
    process.env.NEXT_PUBLIC_NEWS_API_KEY = originalKey;
  });

  it("should handle fetch network errors", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.data).toBeNull();
    expect(mockSetSearchLoading).toHaveBeenCalledWith(false);
  });

  it("should handle HTTP response errors", async () => {
    const errorResponse = { status: "ok", totalResults: 0, articles: [] };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => errorResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("An error occurred, please try refreshing the page.");
    // Note: The hook still sets data even when there's an HTTP error
    expect(result.current.data).toEqual({ ...errorResponse, articles: [] });
  });

  it("should handle API error responses", async () => {
    const errorResponse = {
      status: "error",
      code: "apiKeyInvalid",
      error: "Your API key is invalid.",
      totalResults: 0,
      articles: [],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => errorResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Your API key is invalid.");
    // Note: The hook still sets data even when there's an API error
    expect(result.current.data).toEqual({ ...errorResponse, articles: [] });
  });

  it("should handle API error responses without error message", async () => {
    const errorResponse = {
      status: "error",
      code: "unknownError",
      totalResults: 0,
      articles: [],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => errorResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("An error occurred");
    // Note: The hook still sets data even when there's an API error
    expect(result.current.data).toEqual({ ...errorResponse, articles: [] });
  });

  it("should refetch when country changes", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result, rerender } = renderHook(
      (props: { country: string; query?: string }) => useGetTopHeadlines(props.country, props.query),
      {
        initialProps: { country: "us", query: undefined } as { country: string; query?: string },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    // Change country
    rerender({ country: "gb", query: undefined });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      "https://newsapi.org/v2/top-headlines?country=gb",
      {
        headers: {
          "X-Api-Key": "test-api-key",
        },
      }
    );
  });

  it("should refetch when query changes", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result, rerender } = renderHook(
      (props: { country: string; query?: string }) => useGetTopHeadlines(props.country, props.query),
      {
        initialProps: { country: "us", query: undefined } as { country: string; query?: string },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    // Add query
    rerender({ country: "us", query: "technology" });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      "https://newsapi.org/v2/top-headlines?country=us&q=technology",
      {
        headers: {
          "X-Api-Key": "test-api-key",
        },
      }
    );
  });

  it("should handle non-Error exceptions", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce("String error");

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("An error occurred");
    expect(result.current.data).toBeNull();
  });

  it("should filter duplicate articles from the response", async () => {
    const responseWithDuplicates = {
      status: "ok" as const,
      totalResults: 2,
      articles: [
        mockArticles[0],
        { ...mockArticles[0], url: "different-url" }, // Same title, different URL
      ],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => responseWithDuplicates,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify that duplicate filtering was applied by checking the result
    expect(result.current.data?.articles).toHaveLength(1);
    expect(result.current.data?.articles[0]).toEqual(mockArticles[0]);
  });

  it("should handle empty query string", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us", ""));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Empty query string is falsy, so it should NOT include the query parameter
    expect(fetch).toHaveBeenCalledWith(
      "https://newsapi.org/v2/top-headlines?country=us",
      {
        headers: {
          "X-Api-Key": "test-api-key",
        },
      }
    );
  });
});