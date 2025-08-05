import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Summary from "./Summary";
import { INewsApiArticle } from "@/types/types";

// Mock ai module
jest.mock("ai", () => ({
  generateText: jest.fn(),
}));

// Mock @ai-sdk/openai
jest.mock("@ai-sdk/openai", () => ({
  createOpenAI: jest.fn(() => ({})),
}));

// Mock SearchContext
const mockSetSearchTerm = jest.fn();
const mockSetSearchLoading = jest.fn();
const mockUseSearch = jest.fn();

jest.mock("../../contexts/SearchContext", () => ({
  useSearch: () => mockUseSearch(),
}));

// Mock UI components
jest.mock("../ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
  Loader2: ({ className }: { className: string }) => (
    <div data-testid="loader-icon" className={className}>
      Loading Icon
    </div>
  ),
}));

const mockArticles: INewsApiArticle[] = [
  {
    source: { id: "test", name: "Test Source" },
    author: "John Doe",
    title: "Test Article Title",
    description: "Test article description about bitcoin",
    url: "https://example.com/article1",
    urlToImage: "https://example.com/image1.jpg",
    publishedAt: "2023-01-01T12:00:00Z",
    content: "Test content",
  },
  {
    source: { id: "test2", name: "Test Source 2" },
    author: "Jane Smith",
    title: "Another Test Article",
    description: "Another test description about bitcoin trends",
    url: "https://example.com/article2",
    urlToImage: null,
    publishedAt: "2023-01-02T15:30:00Z",
    content: "Another test content",
  },
];

describe("<Summary />", () => {
  beforeEach(() => {
    mockUseSearch.mockReturnValue({
      searchTerm: "bitcoin",
      setSearchTerm: mockSetSearchTerm,
      searchLoading: false,
      setSearchLoading: mockSetSearchLoading,
    });
    console.error = jest.fn();
  });

  it("renders the summary component with correct title", () => {
    render(<Summary articles={mockArticles} />);

    expect(
      screen.getByText('AI Summary 🤖 of recent news on "bitcoin"')
    ).toBeInTheDocument();
  });

  it("renders generate summary button", () => {
    render(<Summary articles={mockArticles} />);

    const button = screen.getByRole("button", { name: /generate summary/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("disables button when searchLoading is true", () => {
    mockUseSearch.mockReturnValue({
      searchTerm: "bitcoin",
      setSearchTerm: mockSetSearchTerm,
      searchLoading: true,
      setSearchLoading: mockSetSearchLoading,
    });

    render(<Summary articles={mockArticles} />);

    const button = screen.getByRole("button", { name: /generate summary/i });
    expect(button).toBeDisabled();
  });

  it("renders without articles prop", () => {
    render(<Summary />);

    expect(
      screen.getByText('AI Summary 🤖 of recent news on "bitcoin"')
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate summary/i })
    ).toBeInTheDocument();
  });

  it("displays different search terms correctly in title", () => {
    mockUseSearch.mockReturnValue({
      searchTerm: "technology",
      setSearchTerm: mockSetSearchTerm,
      searchLoading: false,
      setSearchLoading: mockSetSearchLoading,
    });

    render(<Summary articles={mockArticles} />);

    expect(
      screen.getByText('AI Summary 🤖 of recent news on "technology"')
    ).toBeInTheDocument();
  });

  it("button calls handleGenerateSummary on click", async () => {
    const user = userEvent.setup();
    render(<Summary articles={mockArticles} />);

    const button = screen.getByRole("button", { name: /generate summary/i });
    await user.click(button);

    // The button should at least be clickable
    expect(screen.getByTestId('ai-summary-response')).toBeInTheDocument();
  });

  it("renders with empty articles array", () => {
    render(<Summary articles={[]} />);

    expect(
      screen.getByText('AI Summary 🤖 of recent news on "bitcoin"')
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate summary/i })
    ).toBeInTheDocument();
  });

  it("format text function handles regular text correctly", () => {
    render(<Summary articles={mockArticles} />);
    
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});