import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignedInHome } from "./signed-in-home";

describe("SignedInHome", () => {
  it("renders the upload hero", () => {
    render(<SignedInHome />);

    expect(
      screen.getByRole("heading", { name: /upload your first skill or agent/i }),
    ).toBeInTheDocument();
  });

  it("renders the recent updates feed with mock content", () => {
    render(<SignedInHome />);

    expect(screen.getByRole("heading", { name: /recent updates/i })).toBeInTheDocument();
    expect(screen.getByText("PDF Table Extractor")).toBeInTheDocument();
  });
});
