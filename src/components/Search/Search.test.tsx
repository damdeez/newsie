import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "./Search";

// Mock next/navigation
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock SearchContext
const mockSetSearchTerm = jest.fn();
const mockSetSearchLoading = jest.fn();
const mockUseSearch = jest.fn();

jest.mock("../../contexts/SearchContext", () => ({
  useSearch: () => mockUseSearch(),
}));

// Mock UI components
jest.mock("../ui/textarea", () => ({
  Textarea: ({
    onChange,
    defaultValue,
    ...props
  }: {
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    defaultValue: string;
    [key: string]: unknown;
  }) => <textarea onChange={onChange} defaultValue={defaultValue} {...props} />,
}));

jest.mock("../ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick: () => void;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
  Loader2: () => <div data-testid="loader-icon">Loading Icon</div>,
}));


describe("<Search />", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
    mockUseSearch.mockReturnValue({
      searchTerm: "",
      setSearchTerm: mockSetSearchTerm,
      searchLoading: false,
      setSearchLoading: mockSetSearchLoading,
      debouncedSearchTerm: "",
    });
  });

  it("renders search input with correct placeholder on home page", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Search />);

    const input = screen.getByPlaceholderText("Search for articles by keyword...");
    expect(input).toBeInTheDocument();
  });

  it("renders filter input with correct placeholder on top-headlines page", () => {
    mockUsePathname.mockReturnValue("/top-headlines");
    render(<Search />);

    const input = screen.getByPlaceholderText("Filter by keyword...");
    expect(input).toBeInTheDocument();
  });

  it("renders search input with default value", () => {
    render(<Search />);

    const input = screen.getByDisplayValue("");
    expect(input).toBeInTheDocument();
  });

  it("updates search term when input value changes", async () => {
    const user = userEvent.setup();

    render(<Search />);

    const input = screen.getByPlaceholderText("Search for articles by keyword...");
    await user.type(input, "new search term");

    expect(input).toHaveValue("new search term");
  });

  it("renders search button on home page", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Search />);

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it("renders filter button on top-headlines page", () => {
    mockUsePathname.mockReturnValue("/top-headlines");
    render(<Search />);

    const button = screen.getByRole("button", { name: /filter/i });
    expect(button).toBeInTheDocument();
  });

  it("handles search button click", async () => {
    const user = userEvent.setup();

    render(<Search />);

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    // Button click should trigger search behavior
    expect(button).toBeInTheDocument();
  });

  it("shows loading icon when searchLoading is true", () => {
    mockUseSearch.mockReturnValue({
      searchTerm: "",
      setSearchTerm: mockSetSearchTerm,
      searchLoading: true,
      setSearchLoading: mockSetSearchLoading,
      debouncedSearchTerm: "",
    });
    render(<Search />);

    const loadingIcon = screen.getByTestId("loader-icon");
    expect(loadingIcon).toBeInTheDocument();
  });

  it("does not show loading icon when searchLoading is false", () => {
    mockUseSearch.mockReturnValue({
      searchTerm: "",
      setSearchTerm: mockSetSearchTerm,
      searchLoading: false,
      setSearchLoading: mockSetSearchLoading,
      debouncedSearchTerm: "",
    });
    render(<Search />);

    const loadingIcon = screen.queryByTestId("loader-icon");
    expect(loadingIcon).not.toBeInTheDocument();
  });
});