import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the getting started heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /to get started, edit the page.tsx file/i }),
    ).toBeInTheDocument();
  });
});
