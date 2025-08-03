import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "./Search";

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
  Loader2Icon: () => <div data-testid="loader-icon">Loading Icon</div>,
}));

describe("<Search />", () => {
  const mockSetSearchTerm = jest.fn();

  beforeEach(() => {
    mockSetSearchTerm.mockClear();
  });

  it("renders search input with correct placeholder", () => {
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const input = screen.getByPlaceholderText("Search for news articles...");
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

    const input = screen.getByPlaceholderText("Search for news articles...");
    await user.type(input, "new search term");

    expect(mockSetSearchTerm).toHaveBeenCalled();
  });

  it("renders search button", () => {
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

  it("applies correct CSS classes to container", () => {
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const container = screen.getByRole("button", {
      name: /search/i,
    }).parentElement;
    expect(container).toHaveClass(
      "flex",
      "flex-row",
      "w-full",
      "gap-2",
      "justify-end",
      "items-center"
    );
  });

  it("textarea has correct attributes", () => {
    render(
      <Search
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        searchLoading={false}
      />
    );

    const input = screen.getByPlaceholderText("Search for news articles...");
    expect(input).toHaveAttribute("id", "search-input");
  });
});
