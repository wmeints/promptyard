import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppErrorProvider } from "@/components/app-error";
import { SignInButton } from "@/components/sign-in-button";

const oauth2 = vi.fn<(...args: unknown[]) => void>();

vi.mock("@/lib/auth-client", () => ({
  authClient: { signIn: { oauth2: (...args: unknown[]) => oauth2(...args) } },
}));

beforeEach(() => {
  oauth2.mockReset();
});

function renderButton(callbackURL?: string) {
  return render(
    <AppErrorProvider>
      <SignInButton callbackURL={callbackURL} />
    </AppErrorProvider>,
  );
}

describe("SignInButton", () => {
  it("forwards a same-site relative callback URL to the auth client", async () => {
    renderButton("/upload");
    await userEvent.click(screen.getByRole("button"));

    expect(oauth2).toHaveBeenCalledWith({ providerId: "keycloak", callbackURL: "/upload" });
  });

  it("clamps an off-site callback URL to the home page", async () => {
    renderButton("https://evil.example/phish");
    await userEvent.click(screen.getByRole("button"));

    expect(oauth2).toHaveBeenCalledWith({ providerId: "keycloak", callbackURL: "/" });
  });
});
