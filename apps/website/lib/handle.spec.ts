import { describe, expect, it } from "vitest";

import { generateUniqueHandle, handleFromEmail } from "./handle";

describe("handleFromEmail", () => {
  it("slugifies the email local-part", () => {
    expect(handleFromEmail("Willem.Meints@infosupport.com")).toBe("willem-meints");
  });

  it("ignores the domain", () => {
    expect(handleFromEmail("jane@example.org")).toBe("jane");
  });

  it("falls back to 'user' when the local-part has no slug characters", () => {
    expect(handleFromEmail("+++@example.org")).toBe("user");
  });
});

describe("generateUniqueHandle", () => {
  it("returns the base handle when it is free", async () => {
    const handle = await generateUniqueHandle("willem.meints@x.io", async () => false);
    expect(handle).toBe("willem-meints");
  });

  it("appends an incrementing suffix until a free handle is found", async () => {
    const taken = new Set(["willem-meints", "willem-meints-2"]);
    const handle = await generateUniqueHandle(
      "willem.meints@x.io",
      async (candidate) => taken.has(candidate),
    );
    expect(handle).toBe("willem-meints-3");
  });

  it("starts suffixing at 2 (never -1)", async () => {
    const taken = new Set(["jane"]);
    const handle = await generateUniqueHandle("jane@x.io", async (c) => taken.has(c));
    expect(handle).toBe("jane-2");
  });
});
