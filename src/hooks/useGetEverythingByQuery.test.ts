import { renderHook, waitFor } from "@testing-library/react";
import { useGetEverythingByQuery } from "./useGetEverythingByQuery";
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

const mockArticles: INewsApiArticle[] = [
  {
    source_id: "test",
    source_name: "Test Source",
    author: "John Doe",
    title: "Test Article",
    description: "Test description",
    link: "https://example.com/article1",
    image_url: "https://example.com/image1.jpg",
    pubDate: "2023-01-01T12:00:00Z",
    content: "Test content",
    category: ["general"],
    country: ["us"],
    language: "en",
    keywords: ["test", "article"],
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

describe("useGetEverythingByQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it("should return initial state", () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsDataResponse,
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
      json: async () => mockNewsDataResponse,
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

    // Verify correct API call (order-insensitive)
    const [url1, opts1] = (fetch as jest.Mock).mock.calls[0];
    expect(url1).toContain(`${API_URL}/news?`);
    expect(url1).toContain("language=en");
    expect(url1).toContain("q=bitcoin");
    expect(opts1).toEqual({ signal: expect.any(AbortSignal) });
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
    // When there's an HTTP error, data should be null
    expect(result.current.data).toBeNull();
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

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("An error occurred");
    // When there's an API error, data should be null
    expect(result.current.data).toBeNull();
  });

  it("should refetch when query changes", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockNewsDataResponse,
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
    const lastCall = (fetch as jest.Mock).mock.calls[(fetch as jest.Mock).mock.calls.length - 1];
    const [url2, opts2] = lastCall;
    expect(url2).toContain(`${API_URL}/news?`);
    expect(url2).toContain("language=en");
    expect(url2).toContain("q=ethereum");
    expect(opts2).toEqual({ signal: expect.any(AbortSignal) });
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

    const { result } = renderHook(() => useGetEverythingByQuery("test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify that duplicate filtering was applied by checking the result
    expect(result.current.data?.articles).toHaveLength(1);
    expect(result.current.data?.articles[0]).toEqual(mockArticles[0]);
  });
});
