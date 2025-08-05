import React from "react";
import { render, screen } from "@testing-library/react";
import Articles from "./Articles";
import { INewsApiArticle } from "@/types/types";

// Mock next/navigation
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
  Loader2: () => <div data-testid="loader">Loading</div>,
}));

const mockArticles: INewsApiArticle[] = [
  {
    source: { id: "test", name: "Test Source" },
    author: "John Doe",
    title: "Test Article Title",
    description: "Test article description",
    url: "https://example.com/article1",
    urlToImage: "https://example.com/image1.jpg",
    publishedAt: "2023-01-01T12:00:00Z",
    content: "Test content",
  },
  {
    source: { id: "test2", name: "Test Source 2" },
    author: null,
    title: "Another Test Article",
    description: "Another test description",
    url: "https://example.com/article2",
    urlToImage: null,
    publishedAt: "2023-01-02T15:30:00Z",
    content: "Another test content",
  },
];

describe("<Articles />", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  it('renders "No articles found" when no articles provided', () => {
    render(<Articles title="Test" articles={[]} loading={false} />);
    expect(screen.getByText("No articles found.")).toBeInTheDocument();
  });

  it('renders "No articles found" when articles is undefined', () => {
    render(<Articles title="Test" loading={false} />);
    expect(screen.getByText("No articles found.")).toBeInTheDocument();
  });

  it("renders Top Headlines title correctly when on top-headlines page", () => {
    mockUsePathname.mockReturnValue("/top-headlines");
    render(<Articles title="Top Headlines" articles={mockArticles} loading={false} />);
    expect(screen.getByText("Top Headlines")).toBeInTheDocument();
  });

  it("renders search results title correctly", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Articles title="bitcoin" articles={mockArticles} loading={false} />);
    expect(
      screen.getByText('Most recent articles for "bitcoin"')
    ).toBeInTheDocument();
  });

  it("renders articles with correct information", () => {
    render(<Articles title="Test" articles={mockArticles} loading={false} />);

    // Check article titles are rendered as links
    expect(screen.getByText("Test Article Title")).toBeInTheDocument();
    expect(screen.getByText("Another Test Article")).toBeInTheDocument();

    // Check links have correct href
    const firstLink = screen.getByRole("link", { name: "Test Article Title" });
    expect(firstLink).toHaveAttribute("href", "https://example.com/article1");
    expect(firstLink).toHaveAttribute("target", "_blank");
    expect(firstLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays author information correctly", () => {
    render(<Articles title="Test" articles={mockArticles} loading={false} />);

    expect(screen.getByText(/by John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/by Unknown/)).toBeInTheDocument();
  });

  it("formats publication dates correctly", () => {
    render(<Articles title="Test" articles={mockArticles} loading={false} />);

    expect(screen.getByText(/1\/1\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/1\/2\/2023/)).toBeInTheDocument();
  });

  xit("renders images when urlToImage is provided", () => {
    render(<Articles title="Test" articles={mockArticles} loading={false} />);

    const image = screen.getByAltText("Test Article Title");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
  });

  it("does not render image when urlToImage is null", () => {
    render(<Articles title="Test" articles={mockArticles} loading={false} />);

    expect(
      screen.queryByAltText("Another Test Article")
    ).not.toBeInTheDocument();
  });
});