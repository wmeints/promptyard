import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppErrorProvider } from "@/components/app-error";
import { UserMenu } from "./user-menu";

vi.mock("@/lib/auth-client", () => ({
  authClient: { signOut: vi.fn<() => Promise<void>>() },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn<() => void>() }),
}));

function renderUserMenu(user: { name?: string | null; email?: string | null }) {
  return render(
    <AppErrorProvider>
      <UserMenu user={user} />
    </AppErrorProvider>,
  );
}

describe("UserMenu", () => {
  it("renders initials derived from the user name", () => {
    renderUserMenu({ name: "Jane Lin", email: "jane@example.com" });

    expect(screen.getByText("JL")).toBeInTheDocument();
  });

  it("exposes an account menu trigger", () => {
    renderUserMenu({ name: "Jane Lin" });

    expect(screen.getByRole("button", { name: /open account menu/i })).toBeInTheDocument();
  });
});
