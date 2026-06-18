import { describe, expect, it } from "vitest";

import { toSafeCallbackURL } from "./safe-callback-url";

describe("toSafeCallbackURL", () => {
  it("keeps a same-site relative path", () => {
    expect(toSafeCallbackURL("/upload")).toBe("/upload");
  });

  it("keeps the root path", () => {
    expect(toSafeCallbackURL("/")).toBe("/");
  });

  it("rejects absolute URLs", () => {
    expect(toSafeCallbackURL("https://evil.example/phish")).toBe("/");
  });

  it("rejects protocol-relative URLs", () => {
    expect(toSafeCallbackURL("//evil.example/phish")).toBe("/");
  });

  it("rejects backslash-prefixed paths browsers normalise to another origin", () => {
    expect(toSafeCallbackURL("/\\evil.example")).toBe("/");
  });

  it("rejects paths that do not start with a slash", () => {
    expect(toSafeCallbackURL("evil.example")).toBe("/");
  });

  it("rejects an empty value", () => {
    expect(toSafeCallbackURL("")).toBe("/");
  });

  it("rejects control characters browsers strip to smuggle a foreign origin", () => {
    // A browser strips the tab, turning "/\t/evil.example" into "//evil.example".
    expect(toSafeCallbackURL("/\t/evil.example")).toBe("/");
  });
});
