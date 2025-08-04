import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "./Search";

// Mock next/navigation
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
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
  const mockSetSearchTerm = jest.fn();

  beforeEach(() => {
    mockSetSearchTerm.mockClear();
    mockUsePathname.mockReturnValue("/");
  });

  it("renders search input with correct placeholder on home page", () => {
    mockUsePathname.mockReturnValue("/");
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const input = screen.getByPlaceholderText("Search for articles by keyword...");
    expect(input).toBeInTheDocument();
  });

  it("renders filter input with correct placeholder on top-headlines page", () => {
    mockUsePathname.mockReturnValue("/top-headlines");
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const input = screen.getByPlaceholderText("Filter by keyword...");
    expect(input).toBeInTheDocument();
  });

  it("renders search input with default value", () => {
    render(
      <Search
        searchTerm="test search"
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const input = screen.getByDisplayValue("test search");
    expect(input).toBeInTheDocument();
  });

  it("calls setSearchTerm when input value changes", async () => {
    const user = userEvent.setup();

    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const input = screen.getByPlaceholderText("Search for articles by keyword...");
    await user.type(input, "new search term");

    expect(mockSetSearchTerm).toHaveBeenCalled();
  });

  it("renders search button on home page", () => {
    mockUsePathname.mockReturnValue("/");
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it("renders filter button on top-headlines page", () => {
    mockUsePathname.mockReturnValue("/top-headlines");
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const button = screen.getByRole("button", { name: /filter/i });
    expect(button).toBeInTheDocument();
  });

  it("calls setSearchTerm when search button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Search
        searchTerm="test"
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(mockSetSearchTerm).toHaveBeenCalledWith("test");
  });

  it("shows loading icon when searchLoading is true", () => {
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={true}
      />
    );

    const loadingIcon = screen.getByTestId("loader-icon");
    expect(loadingIcon).toBeInTheDocument();
  });

  it("does not show loading icon when searchLoading is false", () => {
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const loadingIcon = screen.queryByTestId("loader-icon");
    expect(loadingIcon).not.toBeInTheDocument();
  });
});