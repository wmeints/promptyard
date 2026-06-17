import { describe, expect, it } from "vitest";

import { deriveBaseHandle, generateUniqueHandle } from "./handle";

describe("deriveBaseHandle", () => {
  it("slugifies the email local-part", () => {
    expect(deriveBaseHandle({ email: "Willem.Meints@infosupport.com" })).toBe("willem-meints");
  });

  it("ignores the domain", () => {
    expect(deriveBaseHandle({ email: "jane@example.org" })).toBe("jane");
  });

  it("falls back to the name when the email has no slug characters", () => {
    expect(deriveBaseHandle({ email: "+++@example.org", name: "Jane Doe" })).toBe("jane-doe");
  });

  it("falls back to the name when the email is absent", () => {
    expect(deriveBaseHandle({ name: "Jane Doe" })).toBe("jane-doe");
  });

  it("falls back to a non-empty random token when email and name yield nothing", () => {
    expect(deriveBaseHandle({ email: "+++@example.org", name: "***" })).toMatch(/^[a-z0-9]+$/);
  });

  it("never returns an empty handle when no identity is provided", () => {
    expect(deriveBaseHandle({})).toMatch(/^[a-z0-9]+$/);
  });
});

describe("generateUniqueHandle", () => {
  it("returns the base handle when it is free", async () => {
    const handle = await generateUniqueHandle({ email: "willem.meints@x.io" }, async () => false);
    expect(handle).toBe("willem-meints");
  });

  it("appends an incrementing suffix until a free handle is found", async () => {
    const taken = new Set(["willem-meints", "willem-meints-2"]);
    const handle = await generateUniqueHandle(
      { email: "willem.meints@x.io" },
      async (candidate) => taken.has(candidate),
    );
    expect(handle).toBe("willem-meints-3");
  });

  it("starts suffixing at 2 (never -1)", async () => {
    const taken = new Set(["jane"]);
    const handle = await generateUniqueHandle({ email: "jane@x.io" }, async (c) => taken.has(c));
    expect(handle).toBe("jane-2");
  });
});
