import { describe, expect, it } from "vitest";

import { UploadRejectedError } from "./errors";
import { findSkillFolders, parseSkill } from "./skills";

const encode = (value: string) => new TextEncoder().encode(value);

function archive(files: Record<string, string>): Map<string, Uint8Array> {
  return new Map(Object.entries(files).map(([path, body]) => [path, encode(body)]));
}

const skillManifest = (name: string, description: string) =>
  `---\nname: ${name}\ndescription: ${description}\n---\nBody`;

describe("findSkillFolders", () => {
  it("returns the folders holding a SKILL.md, sorted", () => {
    const folders = findSkillFolders(
      archive({
        "skills/beta/SKILL.md": skillManifest("Beta", "second"),
        "skills/alpha/SKILL.md": skillManifest("Alpha", "first"),
        "skills/alpha/scripts/run.sh": "echo",
        "README.md": "ignored",
      }),
    );

    expect(folders).toEqual(["alpha", "beta"]);
  });

  it("rejects an archive with no skill", () => {
    expect(() => findSkillFolders(archive({ "README.md": "nothing here" }))).toThrow(
      UploadRejectedError,
    );
  });
});

describe("parseSkill", () => {
  it("slugifies the name and collects files relative to the folder", () => {
    const skill = parseSkill(
      "My Demo",
      archive({
        "skills/My Demo/SKILL.md": skillManifest("My Demo Skill", "A demo"),
        "skills/My Demo/scripts/run.sh": "echo hi",
        "README.md": "ignored top-level file",
      }),
    );

    expect(skill.slug).toBe("my-demo-skill");
    expect(skill.description).toBe("A demo");
    expect(skill.files.map((file) => file.relpath)).toEqual(["SKILL.md", "scripts/run.sh"]);
  });

  it("rejects a skill whose frontmatter is missing the name", () => {
    expect(() =>
      parseSkill("demo", archive({ "skills/demo/SKILL.md": "---\ndescription: no name\n---\n" })),
    ).toThrow(/non-empty name and description/);
  });

  it("rejects a skill whose description is blank", () => {
    expect(() =>
      parseSkill("demo", archive({ "skills/demo/SKILL.md": skillManifest("Demo", "   ") })),
    ).toThrow(UploadRejectedError);
  });

  it("rejects a name that does not produce a slug", () => {
    expect(() =>
      parseSkill(
        "demo",
        archive({ "skills/demo/SKILL.md": '---\nname: "+++"\ndescription: has desc\n---\n' }),
      ),
    ).toThrow(/valid slug/);
  });
});
