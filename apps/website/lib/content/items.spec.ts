import { describe, expect, it } from "vitest";

import { dedupeItems, discoverItems, type ParsedItem } from "./items";

const encode = (value: string) => new TextEncoder().encode(value);

function archive(files: Record<string, string>): Map<string, Uint8Array> {
  return new Map(Object.entries(files).map(([path, body]) => [path, encode(body)]));
}

const skillManifest = (name: string, description: string) =>
  `---\nname: ${name}\ndescription: ${description}\n---\nBody`;
const agentMarkdown = (name: string, description: string) =>
  `---\nname: ${name}\ndescription: ${description}\n---\nBody`;

describe("discoverItems", () => {
  it("parses skills and agents from one archive", () => {
    const { items, failures, ignored } = discoverItems(
      archive({
        "skills/demo/SKILL.md": skillManifest("Demo", "a skill"),
        "agents/helper.md": agentMarkdown("Helper", "an agent"),
      }),
    );

    expect(failures).toEqual([]);
    expect(ignored).toEqual([]);
    expect(items.map((item) => [item.type, item.slug])).toEqual([
      ["skill", "demo"],
      ["agent", "helper"],
    ]);
  });

  it("records a parse failure per malformed item without dropping the valid ones", () => {
    const { items, failures } = discoverItems(
      archive({
        "skills/good/SKILL.md": skillManifest("Good", "valid"),
        "skills/bad/SKILL.md": "---\nname: Bad\n---\nno description",
        "agents/broken.md": "no frontmatter at all",
      }),
    );

    expect(items.map((item) => item.slug)).toEqual(["good"]);
    expect(failures).toEqual([
      { type: "skill", name: "bad", status: "failed", message: expect.any(String) },
      { type: "agent", name: "broken", status: "failed", message: expect.any(String) },
    ]);
  });

  it("counts junk and out-of-scope files as ignored", () => {
    const { ignored } = discoverItems(
      archive({
        "skills/demo/SKILL.md": skillManifest("Demo", "a skill"),
        "skills/demo/.DS_Store": "junk",
        "__MACOSX/skills/demo/SKILL.md": "fork",
        "README.md": "top-level doc",
        "agents/nested/deep.md": "not an agent file",
      }),
    );

    expect(ignored).toEqual([
      "README.md",
      "__MACOSX/skills/demo/SKILL.md",
      "agents/nested/deep.md",
      "skills/demo/.DS_Store",
    ]);
  });
});

describe("dedupeItems", () => {
  const skill = (slug: string): ParsedItem => ({
    type: "skill",
    slug,
    description: "d",
    files: [],
  });
  const agent = (slug: string): ParsedItem => ({ type: "agent", slug, description: "d", body: "" });

  it("keeps distinct items and items that differ only by type", () => {
    const { unique, duplicates } = dedupeItems([skill("alpha"), skill("beta"), agent("alpha")]);

    expect(duplicates).toEqual([]);
    expect(unique.map((item) => [item.type, item.slug])).toEqual([
      ["skill", "alpha"],
      ["skill", "beta"],
      ["agent", "alpha"],
    ]);
  });

  it("rejects an in-zip duplicate pair while leaving the rest", () => {
    const { unique, duplicates } = dedupeItems([skill("dup"), skill("dup"), skill("solo")]);

    expect(unique.map((item) => item.slug)).toEqual(["solo"]);
    expect(duplicates).toEqual([
      { type: "skill", name: "dup", status: "failed", message: expect.any(String) },
      { type: "skill", name: "dup", status: "failed", message: expect.any(String) },
    ]);
  });
});
