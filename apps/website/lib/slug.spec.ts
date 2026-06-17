import { describe, expect, it } from "vitest";

import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates whitespace", () => {
    expect(slugify("Code Review Helper")).toBe("code-review-helper");
  });

  it("collapses runs of separators into a single hyphen", () => {
    expect(slugify("a -- b__c")).toBe("a-b-c");
  });

  it("strips leading and trailing separators", () => {
    expect(slugify("  --Hello!--  ")).toBe("hello");
  });

  it("removes diacritics", () => {
    expect(slugify("Willém Meïnts")).toBe("willem-meints");
  });

  it("drops characters that are not URL-safe", () => {
    expect(slugify("c++ & rust @ scale")).toBe("c-rust-scale");
  });

  it("returns an empty string when nothing slug-worthy remains", () => {
    expect(slugify("!!!")).toBe("");
  });
});
