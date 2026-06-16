import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserMenu } from "./user-menu";

vi.mock("@/lib/auth-client", () => ({
  authClient: { signOut: vi.fn<() => Promise<void>>() },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn<() => void>() }),
}));

describe("UserMenu", () => {
  it("renders initials derived from the user name", () => {
    render(<UserMenu user={{ name: "Jane Lin", email: "jane@example.com" }} />);

    expect(screen.getByText("JL")).toBeInTheDocument();
  });

  it("exposes an account menu trigger", () => {
    render(<UserMenu user={{ name: "Jane Lin" }} />);

    expect(screen.getByRole("button", { name: /open account menu/i })).toBeInTheDocument();
  });
});
