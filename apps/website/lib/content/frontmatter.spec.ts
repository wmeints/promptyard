import { describe, expect, it } from "vitest";

import { parseFrontmatter } from "./frontmatter";

describe("parseFrontmatter", () => {
  it("reads name and description from a frontmatter block", () => {
    const markdown = "---\nname: My Skill\ndescription: Does a thing\n---\n# Body\n";
    expect(parseFrontmatter(markdown)).toEqual({ name: "My Skill", description: "Does a thing" });
  });

  it("tolerates CRLF line endings", () => {
    const markdown = "---\r\nname: Win Skill\r\ndescription: Cross platform\r\n---\r\nBody";
    expect(parseFrontmatter(markdown)).toEqual({
      name: "Win Skill",
      description: "Cross platform",
    });
  });

  it("returns an empty object when no frontmatter fence is present", () => {
    expect(parseFrontmatter("# Just a heading\n")).toEqual({});
  });

  it("returns an empty object for malformed YAML", () => {
    expect(parseFrontmatter("---\nname: : :\n  bad\n---\n")).toEqual({});
  });

  it("ignores non-string field values", () => {
    expect(parseFrontmatter("---\nname:\n  - 1\ndescription: 42\n---\n")).toEqual({
      name: undefined,
      description: undefined,
    });
  });
});
