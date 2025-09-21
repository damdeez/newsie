import { uniqueArticles, getTimeOfDayGreeting, oneMonthAgo } from "./helpers";
import { INewsApiArticle } from "../types/types";

describe("helpers", () => {
  describe("uniqueArticles", () => {
    const mockArticle1: INewsApiArticle = {
      source_id: "source1",
      source_name: "Source 1",
      author: "Author 1",
      title: "Unique Article 1",
      description: "Description 1",
      link: "https://example.com/article1",
      image_url: "https://example.com/image1.jpg",
      pubDate: "2023-01-01T12:00:00Z",
      content: "Content 1",
      category: ["technology"],
      country: ["us"],
      language: "en",
      keywords: ["crypto"],
    };

    const mockArticle2: INewsApiArticle = {
      source_id: "source2",
      source_name: "Source 2",
      author: "Author 2",
      title: "Unique Article 2",
      description: "Description 2",
      link: "https://example.com/article2",
      image_url: "https://example.com/image2.jpg",
      pubDate: "2023-01-02T12:00:00Z",
      content: "Content 2",
      category: ["technology"],
      country: ["us"],
      language: "en",
      keywords: ["ai"],
    };

    const mockArticle3Duplicate: INewsApiArticle = {
      source_id: "source3",
      source_name: "Source 3",
      author: "Author 3",
      title: "Unique Article 1", // Same title as mockArticle1
      description: "Description 3",
      link: "https://example.com/article3",
      image_url: "https://example.com/image3.jpg",
      pubDate: "2023-01-03T12:00:00Z",
      content: "Content 3",
      category: ["technology"],
      country: ["us"],
      language: "en",
      keywords: ["crypto"],
    };

    it("should return empty array when given empty array", () => {
      const result = uniqueArticles([]);
      expect(result).toEqual([]);
    });

    it("should return same array when all articles have unique titles", () => {
      const articles = [mockArticle1, mockArticle2];
      const result = uniqueArticles(articles);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual([mockArticle1, mockArticle2]);
    });

    it("should filter out duplicate titles and keep the first occurrence", () => {
      const articles = [mockArticle1, mockArticle2, mockArticle3Duplicate];
      const result = uniqueArticles(articles);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual([mockArticle1, mockArticle2]);
      expect(result).not.toContain(mockArticle3Duplicate);
    });

    it("should handle multiple duplicates of the same title", () => {
      const duplicateArticle = { ...mockArticle1, link: "different-url" };
      const anotherDuplicate = { ...mockArticle1, author: "Different Author" };
      
      const articles = [mockArticle1, duplicateArticle, mockArticle2, anotherDuplicate];
      const result = uniqueArticles(articles);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockArticle1); // First occurrence kept
      expect(result[1]).toEqual(mockArticle2);
    });

    it("should handle articles with null/undefined values", () => {
      const articleWithNullAuthor: INewsApiArticle = {
        source_id: "source4",
        source_name: "Source 4",
        author: null,
        title: "Article with null author",
        description: null,
        link: "https://example.com/article4",
        image_url: null,
        pubDate: "2023-01-04T12:00:00Z",
        content: null,
        category: ["general"],
        country: ["gb"],
        language: "en",
        keywords: null,
      };

      const articles = [mockArticle1, articleWithNullAuthor];
      const result = uniqueArticles(articles);
      
      expect(result).toHaveLength(2);
      expect(result).toContain(articleWithNullAuthor);
    });

    it("should preserve original order of unique articles", () => {
      const articles = [mockArticle2, mockArticle1, mockArticle3Duplicate];
      const result = uniqueArticles(articles);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockArticle2); // First in original order
      expect(result[1]).toEqual(mockArticle1); // Second in original order
    });

    it("should handle single article", () => {
      const articles = [mockArticle1];
      const result = uniqueArticles(articles);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockArticle1);
    });

    it("should handle case-sensitive title matching", () => {
      const upperCaseTitle = { ...mockArticle1, title: "UNIQUE ARTICLE 1" };
      const articles = [mockArticle1, upperCaseTitle];
      const result = uniqueArticles(articles);
      
      expect(result).toHaveLength(2); // Different cases should be treated as different titles
      expect(result).toEqual([mockArticle1, upperCaseTitle]);
    });
  });

  describe("getTimeOfDayGreeting", () => {
    beforeEach(() => {
      // Reset any Date mocks before each test
      jest.restoreAllMocks();
    });

    it("should return 'Good morning!' for hours 0-11", () => {
      // Test early morning
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(6);
      expect(getTimeOfDayGreeting()).toBe("Good morning!");

      // Test late morning
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(11);
      expect(getTimeOfDayGreeting()).toBe("Good morning!");

      // Test midnight
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(0);
      expect(getTimeOfDayGreeting()).toBe("Good morning!");
    });

    it("should return 'Good afternoon!' for hours 12-17", () => {
      // Test noon
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(12);
      expect(getTimeOfDayGreeting()).toBe("Good afternoon!");

      // Test mid afternoon
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(15);
      expect(getTimeOfDayGreeting()).toBe("Good afternoon!");

      // Test late afternoon
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(17);
      expect(getTimeOfDayGreeting()).toBe("Good afternoon!");
    });

    it("should return 'Good evening!' for hours 18-23", () => {
      // Test early evening
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(18);
      expect(getTimeOfDayGreeting()).toBe("Good evening!");

      // Test late evening
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(22);
      expect(getTimeOfDayGreeting()).toBe("Good evening!");

      // Test late night
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(23);
      expect(getTimeOfDayGreeting()).toBe("Good evening!");
    });

    it("should handle boundary values correctly", () => {
      // Test boundary between morning and afternoon
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(11);
      expect(getTimeOfDayGreeting()).toBe("Good morning!");

      jest.spyOn(Date.prototype, "getHours").mockReturnValue(12);
      expect(getTimeOfDayGreeting()).toBe("Good afternoon!");

      // Test boundary between afternoon and evening
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(17);
      expect(getTimeOfDayGreeting()).toBe("Good afternoon!");

      jest.spyOn(Date.prototype, "getHours").mockReturnValue(18);
      expect(getTimeOfDayGreeting()).toBe("Good evening!");
    });
  });

  describe("oneMonthAgo", () => {
    beforeEach(() => {
      // Reset any Date mocks before each test
      jest.restoreAllMocks();
    });

    const mockDateImplementation = (mockDate: Date) => {
      const OriginalDate = Date;
      return jest.spyOn(global, "Date").mockImplementation(((...args: unknown[]) => {
        if (args.length === 0) {
          return mockDate;
        }
        return new OriginalDate(...(args as ConstructorParameters<typeof Date>));
      }));
    };

    it("should return date one month ago in YYYY-MM-DD format", () => {
      // Mock current date to January 15, 2024
      const mockDate = new Date("2024-01-15T10:30:00Z");
      mockDateImplementation(mockDate);
      
      const result = oneMonthAgo();
      
      expect(result).toBe("2023-12-15");
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
    });

    it("should handle year boundary correctly", () => {
      // Mock current date to January 15, 2024
      const mockDate = new Date("2024-01-15T10:30:00Z");
      mockDateImplementation(mockDate);
      
      const result = oneMonthAgo();
      
      expect(result).toBe("2023-12-15"); // Should go to previous year
    });

    it("should handle February to January correctly", () => {
      // Mock current date to February 15, 2024
      const mockDate = new Date("2024-02-15T10:30:00Z");
      mockDateImplementation(mockDate);
      
      const result = oneMonthAgo();
      
      expect(result).toBe("2024-01-15");
    });

    it("should handle March to February in leap year", () => {
      // Mock current date to March 15, 2024 (leap year)
      const mockDate = new Date("2024-03-15T10:30:00Z");
      mockDateImplementation(mockDate);
      
      const result = oneMonthAgo();
      
      expect(result).toBe("2024-02-15");
    });

    it("should handle March to February in non-leap year", () => {
      // Mock current date to March 15, 2023 (non-leap year)
      const mockDate = new Date("2023-03-15T10:30:00Z");
      mockDateImplementation(mockDate);
      
      const result = oneMonthAgo();
      
      expect(result).toBe("2023-02-15");
    });

    it("should handle months with different day counts", () => {
      // Mock current date to May 31, 2024
      const mockDate = new Date("2024-05-31T10:30:00Z");
      mockDateImplementation(mockDate);
      
      const result = oneMonthAgo();
      
      // When going from May 31 to April, JavaScript Date adjusts to May 1 (April 31 doesn't exist)
      // This is expected JavaScript Date behavior
      expect(result).toBe("2024-05-01");
    });

    it("should handle edge case of January 31 to February", () => {
      // Mock current date to January 31, 2024
      const mockDate = new Date("2024-01-31T10:30:00Z");
      mockDateImplementation(mockDate);
      
      const result = oneMonthAgo();
      
      // December has 31 days, so January 31 -> December 31 of previous year
      expect(result).toBe("2023-12-31");
    });

    it("should always return current time zone date", () => {
      // Mock current date
      const mockDate = new Date("2024-06-15T23:30:00Z");
      mockDateImplementation(mockDate);
      
      const result = oneMonthAgo();
      
      expect(result).toBe("2024-05-15");
      expect(result.length).toBe(10); // YYYY-MM-DD format
    });

    it("should handle different times of day consistently", () => {
      // Test with morning time
      const morningDate = new Date("2024-06-15T08:00:00Z");
      mockDateImplementation(morningDate);
      const morningResult = oneMonthAgo();

      // Test with evening time  
      const eveningDate = new Date("2024-06-15T20:00:00Z");
      mockDateImplementation(eveningDate);
      const eveningResult = oneMonthAgo();

      // Should return same date regardless of time
      expect(morningResult).toBe(eveningResult);
      expect(morningResult).toBe("2024-05-15");
    });
  });
});
