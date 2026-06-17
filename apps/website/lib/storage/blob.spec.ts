import { describe, expect, it } from "vitest";

import { blobKey } from "./blob";

describe("blobKey", () => {
  it("builds the content/<contentId>/<versionId>/<relpath> key", () => {
    expect(blobKey("c1", "v1", "SKILL.md")).toBe("content/c1/v1/SKILL.md");
  });

  it("preserves nested relative paths", () => {
    expect(blobKey("c1", "v1", "scripts/run.ts")).toBe("content/c1/v1/scripts/run.ts");
  });

  it("strips a leading slash from the relpath so keys never double up", () => {
    expect(blobKey("c1", "v1", "/SKILL.md")).toBe("content/c1/v1/SKILL.md");
  });
});
