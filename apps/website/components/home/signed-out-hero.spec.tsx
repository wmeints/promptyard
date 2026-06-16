import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignedOutHero } from "./signed-out-hero";

vi.mock("@/lib/auth-client", () => ({
  authClient: { signIn: { oauth2: vi.fn<() => Promise<void>>() } },
}));

describe("SignedOutHero", () => {
  it("renders the hero heading", () => {
    render(<SignedOutHero />);

    expect(
      screen.getByRole("heading", { name: /share the skills and agents/i }),
    ).toBeInTheDocument();
  });

  it("renders a sign-in call to action", () => {
    render(<SignedOutHero />);

    expect(
      screen.getByRole("button", { name: /sign in to get started/i }),
    ).toBeInTheDocument();
  });
});
