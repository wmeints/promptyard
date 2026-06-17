import { describe, expect, it } from "vitest";

import { isUniqueViolation } from "./store";

describe("isUniqueViolation", () => {
  it("matches a PostgreSQL unique-violation error", () => {
    expect(isUniqueViolation({ code: "23505" })).toBe(true);
  });

  it("ignores other errors and non-error values", () => {
    expect(isUniqueViolation({ code: "23503" })).toBe(false);
    expect(isUniqueViolation(new Error("boom"))).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation("23505")).toBe(false);
  });
});
