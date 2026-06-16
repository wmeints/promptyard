import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn<() => Promise<unknown>>();

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession } },
}));

vi.mock("next/headers", () => ({
  headers: () => Promise.resolve(new Headers()),
}));

const TRUSTED_ISSUER = "https://keycloak.example.com/realms/promptyard";

async function loadSession() {
  // Re-import so the module re-reads KEYCLOAK_ISSUER for the configured origin.
  vi.resetModules();
  return import("./session");
}

describe("getCurrentSession", () => {
  beforeEach(() => {
    vi.stubEnv("KEYCLOAK_ISSUER", TRUSTED_ISSUER);
    getSession.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps avatar URLs served by the trusted Keycloak origin", async () => {
    getSession.mockResolvedValue({
      session: {},
      user: { image: "https://keycloak.example.com/avatars/jane.png" },
    });

    const { getCurrentSession } = await loadSession();
    const result = await getCurrentSession();

    expect(result?.user.image).toBe("https://keycloak.example.com/avatars/jane.png");
  });

  it("drops avatar URLs from any other origin", async () => {
    getSession.mockResolvedValue({
      session: {},
      user: { image: "https://evil.example.com/track.gif" },
    });

    const { getCurrentSession } = await loadSession();
    const result = await getCurrentSession();

    expect(result?.user.image).toBeNull();
  });

  it("returns null when no session is present", async () => {
    getSession.mockResolvedValue(null);

    const { getCurrentSession } = await loadSession();

    expect(await getCurrentSession()).toBeNull();
  });
});
