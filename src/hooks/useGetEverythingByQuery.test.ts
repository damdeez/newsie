import { renderHook, waitFor } from "@testing-library/react";
import { useGetEverythingByQuery } from "./useGetEverythingByQuery";
import { INewsApiResponse, INewsApiArticle } from "../types/types";

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

// Mock the oneMonthAgo function since it's used in the hook
jest.mock("../utils/helpers", () => {
  const actual = jest.requireActual("../utils/helpers");
  return {
    ...actual,
    oneMonthAgo: jest.fn(() => "2023-01-01"),
  };
});

jest.mock("../utils/constants", () => ({
  API_URL: "https://newsapi.org/v2",
}));

const mockArticles: INewsApiArticle[] = [
  {
    source: { id: "test", name: "Test Source" },
    author: "John Doe",
    title: "Test Article",
    description: "Test description",
    url: "https://example.com/article1",
    urlToImage: "https://example.com/image1.jpg",
    publishedAt: "2023-01-01T12:00:00Z",
    content: "Test content",
  },
];

const mockSuccessResponse: INewsApiResponse = {
  status: "ok",
  totalResults: 1,
  articles: mockArticles,
};

global.fetch = jest.fn();

describe("useGetEverythingByQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it("should return initial state", () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should not fetch when query is empty", () => {
    const { result } = renderHook(() => useGetEverythingByQuery(""));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true); // Loading is set to true initially
    expect(result.current.error).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should fetch data successfully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result } = renderHook(() => useGetEverythingByQuery("bitcoin"));

    expect(result.current.loading).toBe(true);
    expect(mockSetSearchLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockSuccessResponse);
    expect(result.current.error).toBeNull();
    expect(mockSetSearchLoading).toHaveBeenCalledWith(false);

    // Verify correct API call
    expect(fetch).toHaveBeenCalledWith(
      "https://newsapi.org/v2/everything?language=en&from=2023-01-01&sortBy=publishedAt&q=bitcoin",
      {
        headers: {
          "X-Api-Key": "test-api-key",
        },
      }
    );
  });

  it("should handle fetch network errors", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

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
      status: 400,
      json: async () => errorResponse,
    });

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

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
      code: "apiKeyMissing",
      error: "Your API key is missing.",
      totalResults: 0,
      articles: [],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => errorResponse,
    });

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Your API key is missing.");
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

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("An error occurred");
    // Note: The hook still sets data even when there's an API error
    expect(result.current.data).toEqual({ ...errorResponse, articles: [] });
  });

  it("should refetch when query changes", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const { result, rerender } = renderHook(
      ({ query }: { query: string }) => useGetEverythingByQuery(query),
      {
        initialProps: { query: "bitcoin" },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    // Change query
    rerender({ query: "ethereum" });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      "https://newsapi.org/v2/everything?language=en&from=2023-01-01&sortBy=publishedAt&q=ethereum",
      {
        headers: {
          "X-Api-Key": "test-api-key",
        },
      }
    );
  });

  it("should handle non-Error exceptions", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce("String error");

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

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

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify that duplicate filtering was applied by checking the result
    expect(result.current.data?.articles).toHaveLength(1);
    expect(result.current.data?.articles[0]).toEqual(mockArticles[0]);
  });
});