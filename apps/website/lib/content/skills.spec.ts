import { describe, expect, it } from "vitest";

import { UploadRejectedError } from "./errors";
import { extractSkills } from "./skills";

const encode = (value: string) => new TextEncoder().encode(value);

function archive(files: Record<string, string>): Map<string, Uint8Array> {
  return new Map(Object.entries(files).map(([path, body]) => [path, encode(body)]));
}

const skillManifest = (name: string, description: string) =>
  `---\nname: ${name}\ndescription: ${description}\n---\nBody`;

describe("extractSkills", () => {
  it("parses a skill, slugifies the name, and collects its files relative to the folder", () => {
    const skills = extractSkills(
      archive({
        "skills/My Demo/SKILL.md": skillManifest("My Demo Skill", "A demo"),
        "skills/My Demo/scripts/run.sh": "echo hi",
        "README.md": "ignored top-level file",
      }),
    );

    expect(skills).toHaveLength(1);
    expect(skills[0].slug).toBe("my-demo-skill");
    expect(skills[0].description).toBe("A demo");
    expect(skills[0].files.map((file) => file.relpath)).toEqual(["SKILL.md", "scripts/run.sh"]);
  });

  it("returns multiple skills sorted by folder", () => {
    const skills = extractSkills(
      archive({
        "skills/beta/SKILL.md": skillManifest("Beta", "second"),
        "skills/alpha/SKILL.md": skillManifest("Alpha", "first"),
      }),
    );

    expect(skills.map((skill) => skill.slug)).toEqual(["alpha", "beta"]);
  });

  it("rejects an archive with no skill", () => {
    expect(() => extractSkills(archive({ "README.md": "nothing here" }))).toThrow(
      UploadRejectedError,
    );
  });

  it("rejects a skill whose frontmatter is missing the name", () => {
    expect(() =>
      extractSkills(archive({ "skills/demo/SKILL.md": "---\ndescription: no name\n---\n" })),
    ).toThrow(/non-empty name and description/);
  });

  it("rejects a skill whose description is blank", () => {
    expect(() =>
      extractSkills(archive({ "skills/demo/SKILL.md": skillManifest("Demo", "   ") })),
    ).toThrow(UploadRejectedError);
  });

  it("rejects a name that does not produce a slug", () => {
    expect(() =>
      extractSkills(
        archive({ "skills/demo/SKILL.md": '---\nname: "+++"\ndescription: has desc\n---\n' }),
      ),
    ).toThrow(/valid slug/);
  });
});
