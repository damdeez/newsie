import { renderHook, waitFor } from "@testing-library/react";
import { useGetTopHeadlines } from "./useGetTopHeadlines";
import { INewsApiResponse, INewsApiArticle } from "../types/types";
import { API_URL } from "@/utils/constants";

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
    NEXT_PUBLIC_NEWSDATA_API_KEY: "test-api-key",
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
  API_URL: "https://newsdata.io/api/1",
}));

const mockArticles: INewsApiArticle[] = [
  {
    source_id: "test",
    source_name: "Test Source",
    author: "Jane Doe",
    title: "Breaking News",
    description: "Important news description",
    link: "https://example.com/breaking-news",
    image_url: "https://example.com/breaking.jpg",
    pubDate: "2023-01-01T12:00:00Z",
    content: "Breaking news content",
    category: ["general"],
    country: ["us"],
    language: "en",
    keywords: ["breaking", "news"],
  },
];

const mockNewsDataResponse = {
  status: "success",
  totalResults: 1,
  results: mockArticles,
};

const mockSuccessResponse: INewsApiResponse = {
  status: "success",
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
      json: async () => mockNewsDataResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fetch top headlines successfully without query", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsDataResponse,
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

    // Verify correct API call without query (order-insensitive)
    const [url1, opts1] = (fetch as jest.Mock).mock.calls[0];
    expect(url1).toContain(`${API_URL}/news?`);
    expect(url1).toContain("country=us");
    expect(url1).toContain("language=en");
    expect(opts1).toEqual({ signal: expect.any(AbortSignal) });
  });

  it("should fetch top headlines successfully with query", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsDataResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us", "bitcoin"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockSuccessResponse);
    expect(result.current.error).toBeNull();

    // Verify correct API call with query (order-insensitive)
    const [url2, opts2] = (fetch as jest.Mock).mock.calls[0];
    expect(url2).toContain(`${API_URL}/news?`);
    expect(url2).toContain("country=us");
    expect(url2).toContain("language=en");
    expect(url2).toContain("q=bitcoin");
    expect(opts2).toEqual({ signal: expect.any(AbortSignal) });
  });

  it("should handle missing API key", async () => {
    // Temporarily remove API key
    const originalKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    delete process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsDataResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify API call was made with required params
    const [url3, opts3] = (fetch as jest.Mock).mock.calls[0];
    expect(url3).toContain(`${API_URL}/news?`);
    expect(url3).toContain("country=us");
    expect(url3).toContain("language=en");
    expect(opts3).toEqual({ signal: expect.any(AbortSignal) });

    // Restore API key
    process.env.NEXT_PUBLIC_NEWSDATA_API_KEY = originalKey;
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
    // When there's an HTTP error, data should be null
    expect(result.current.data).toBeNull();
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
    // When there's an API error, data should be null
    expect(result.current.data).toBeNull();
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
    // When there's an API error, data should be null
    expect(result.current.data).toBeNull();
  });

  it("should refetch when country changes", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockNewsDataResponse,
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
    const lastCall1 = (fetch as jest.Mock).mock.calls[(fetch as jest.Mock).mock.calls.length - 1];
    const [url4, opts4] = lastCall1;
    expect(url4).toContain(`${API_URL}/news?`);
    expect(url4).toContain("country=gb");
    expect(url4).toContain("language=en");
    expect(opts4).toEqual({ signal: expect.any(AbortSignal) });
  });

  it("should refetch when query changes", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockNewsDataResponse,
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
    const lastCall2 = (fetch as jest.Mock).mock.calls[(fetch as jest.Mock).mock.calls.length - 1];
    const [url5, opts5] = lastCall2;
    expect(url5).toContain(`${API_URL}/news?`);
    expect(url5).toContain("country=us");
    expect(url5).toContain("language=en");
    expect(url5).toContain("q=technology");
    expect(opts5).toEqual({ signal: expect.any(AbortSignal) });
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
      status: "success" as const,
      totalResults: 2,
      results: [
        mockArticles[0],
        { ...mockArticles[0], link: "different-url" }, // Same title, different URL
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
      json: async () => mockNewsDataResponse,
    });

    const { result } = renderHook(() => useGetTopHeadlines("us", ""));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Empty query string is falsy, so it should NOT include the query parameter
    const [url6, opts6] = (fetch as jest.Mock).mock.calls[0];
    expect(url6).toContain(`${API_URL}/news?`);
    expect(url6).toContain("country=us");
    expect(url6).toContain("language=en");
    expect(url6).not.toContain("q=");
    expect(opts6).toEqual({ signal: expect.any(AbortSignal) });
  });
});
