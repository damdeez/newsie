import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// Mock Search component
jest.mock("../Search/Search", () => {
  return function MockSearch({
    searchTerm,
    setSearchTerm,
    searchLoading,
  }: {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchLoading: boolean;
  }) {
    return (
      <div data-testid="search-component">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        {searchLoading && <div data-testid="search-loading">Loading</div>}
      </div>
    );
  };
});

describe("<Header />", () => {
  const mockSetSearchTerm = jest.fn();

  beforeEach(() => {
    mockSetSearchTerm.mockClear();
  });

  it("renders the logo correctly", () => {
    render(<Header searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const logo = screen.getByAltText("Newsie logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/newsie.svg");
  });

  it("renders navigation links correctly", () => {
    render(<Header searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const headlinesLink = screen.getByRole("link", { name: "Top Headlines" });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    expect(headlinesLink).toBeInTheDocument();
    expect(headlinesLink).toHaveAttribute("href", "/top-headlines");
  });

  it("renders Search component with correct props", () => {
    render(
      <Header
        searchTerm="test search"
        setSearchTerm={mockSetSearchTerm}
        loading={true}
      />
    );

    const searchComponent = screen.getByTestId("search-component");
    const searchInput = screen.getByTestId("search-input");
    const loadingIndicator = screen.getByTestId("search-loading");

    expect(searchComponent).toBeInTheDocument();
    expect(searchInput).toHaveValue("test search");
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("passes loading prop to Search component correctly when false", () => {
    render(
      <Header
        searchTerm="test"
        setSearchTerm={mockSetSearchTerm}
        loading={false}
      />
    );

    expect(screen.queryByTestId("search-loading")).not.toBeInTheDocument();
  });

  it("uses default loading value when not provided", () => {
    render(<Header searchTerm="test" setSearchTerm={mockSetSearchTerm} />);

    expect(screen.queryByTestId("search-loading")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes to navigation links", () => {
    render(<Header searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveClass(
      "w-[120px]",
      "h-[35px]",
      "flex",
      "justify-center",
      "items-center"
    );
  });
});
