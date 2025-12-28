import { describe, it, expect, vi, beforeEach } from "vitest";

// Store mock function references
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockSignUp = vi.fn();
const mockUseSession = vi.fn();
const mockCreateAuthClient = vi.fn(() => ({
    signIn: mockSignIn,
    signOut: mockSignOut,
    signUp: mockSignUp,
    useSession: mockUseSession,
}));

// Mock better-auth/react
vi.mock("better-auth/react", () => ({
    createAuthClient: mockCreateAuthClient,
}));

describe("auth-client", () => {
    describe("createAuthClient", () => {
        beforeEach(() => {
            mockCreateAuthClient.mockClear();
        });

        describe("when NEXT_PUBLIC_APP_URL is set", () => {
            it("creates auth client with the configured base URL", async () => {
                const originalUrl = process.env.NEXT_PUBLIC_APP_URL;
                process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

                // Re-import the module to pick up the new env var
                const mod = await import("./auth-client?url=1");

                expect(mockCreateAuthClient).toHaveBeenCalledWith({
                    baseURL: "https://example.com",
                });

                // Restore original env var
                process.env.NEXT_PUBLIC_APP_URL = originalUrl;
            });
        });

        describe("when NEXT_PUBLIC_APP_URL is not set", () => {
            it("creates auth client with default localhost URL", async () => {
                const originalUrl = process.env.NEXT_PUBLIC_APP_URL;
                delete process.env.NEXT_PUBLIC_APP_URL;

                // Re-import the module to pick up the new env var
                const mod = await import("./auth-client?url=2");

                expect(mockCreateAuthClient).toHaveBeenCalledWith({
                    baseURL: "http://localhost:3000",
                });

                // Restore original env var
                if (originalUrl !== undefined) {
                    process.env.NEXT_PUBLIC_APP_URL = originalUrl;
                }
            });
        });
    });
});
