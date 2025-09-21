import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

jest.mock("lucide-react", () => ({
  SquareArrowOutUpRight: ({ size }: { size: number }) => (
    <svg data-testid="footer-icon" data-size={size} />
  ),
}));

describe("<Footer />", () => {
  it("renders default footer content", () => {
    render(<Footer />);

    const link = screen.getByRole("link", { name: /Created by Damir/ });
    expect(link).toHaveAttribute("href", "https://www.damir.fun");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("Created by Damir 👾");
    expect(screen.getByTestId("footer-icon")).toBeInTheDocument();
  });

  it("supports overriding the emoji", () => {
    render(<Footer emoji="👨‍💻" />);

    expect(
      screen.getByRole("link", { name: /Created by Damir 👨‍💻/ })
    ).toBeInTheDocument();
  });
});
