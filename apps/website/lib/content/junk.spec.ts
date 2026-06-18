import { describe, expect, it } from "vitest";

import { isJunk } from "./junk";

describe("isJunk", () => {
  it("flags macOS .DS_Store anywhere in the tree", () => {
    expect(isJunk(".DS_Store")).toBe(true);
    expect(isJunk("skills/demo/.DS_Store")).toBe(true);
  });

  it("flags __MACOSX resource forks and .git directories", () => {
    expect(isJunk("__MACOSX/skills/demo/SKILL.md")).toBe(true);
    expect(isJunk(".git/config")).toBe(true);
    expect(isJunk("skills/demo/.git/HEAD")).toBe(true);
  });

  it("leaves real content alone", () => {
    expect(isJunk("skills/demo/SKILL.md")).toBe(false);
    expect(isJunk("agents/helper.md")).toBe(false);
    expect(isJunk("skills/demo/.gitignore")).toBe(false);
  });
});
