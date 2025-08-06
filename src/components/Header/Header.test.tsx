import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

// Mock next/navigation
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

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
    searchLoading,
  }: {
    searchLoading: boolean;
  }) {
    return (
      <div data-testid="search-component">
        <input
          data-testid="search-input"
        />
        {searchLoading && <div data-testid="search-loading">Loading</div>}
      </div>
    );
  };
});

// Mock SearchProvider
const MockSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const mockContextValue = {
    searchTerm: "",
    setSearchTerm: jest.fn(),
    searchLoading: false,
    setSearchLoading: jest.fn(),
  };
  
  return React.createElement(
    React.createContext(mockContextValue).Provider,
    { value: mockContextValue },
    children
  );
};

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MockSearchProvider>
    {children}
  </MockSearchProvider>
);

describe("<Header />", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  it("renders the logo correctly", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const logo = screen.getByAltText("Newsie logo");
    expect(logo).toBeInTheDocument();
  });

  it("renders navigation links correctly", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    const headlinesLink = screen.getByRole("link", { name: "Top Headlines" });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    expect(headlinesLink).toBeInTheDocument();
    expect(headlinesLink).toHaveAttribute("href", "/top-headlines");
  });

  it("uses default loading value when not provided", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.queryByTestId("search-loading")).not.toBeInTheDocument();
  });
});