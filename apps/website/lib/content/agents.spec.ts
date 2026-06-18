import { describe, expect, it } from "vitest";

import { agentLabel, findAgentFiles, parseAgent } from "./agents";
import { UploadRejectedError } from "./errors";

const encode = (value: string) => new TextEncoder().encode(value);

function archive(files: Record<string, string>): Map<string, Uint8Array> {
  return new Map(Object.entries(files).map(([path, body]) => [path, encode(body)]));
}

const agentMarkdown = (name: string, description: string) =>
  `---\nname: ${name}\ndescription: ${description}\n---\nDo the thing.`;

describe("findAgentFiles", () => {
  it("returns the top-level agent markdown files, sorted", () => {
    const paths = findAgentFiles(
      archive({
        "agents/zebra.md": agentMarkdown("Zebra", "z"),
        "agents/apple.md": agentMarkdown("Apple", "a"),
        "agents/nested/deep.md": "not an agent",
        "skills/demo/SKILL.md": "ignored",
      }),
    );

    expect(paths).toEqual(["agents/apple.md", "agents/zebra.md"]);
  });
});

describe("parseAgent", () => {
  it("slugifies the frontmatter name and stores the full file as the body", () => {
    const markdown = agentMarkdown("My Helper Agent", "Helps out");
    const agent = parseAgent("agents/helper.md", archive({ "agents/helper.md": markdown }));

    expect(agent).toEqual({
      type: "agent",
      slug: "my-helper-agent",
      description: "Helps out",
      body: markdown,
    });
  });

  it("rejects an agent whose frontmatter is missing a field", () => {
    expect(() =>
      parseAgent(
        "agents/bad.md",
        archive({ "agents/bad.md": "---\nname: Bad\n---\nNo description" }),
      ),
    ).toThrow(UploadRejectedError);
  });

  it("rejects a name that does not produce a slug", () => {
    expect(() =>
      parseAgent(
        "agents/bad.md",
        archive({ "agents/bad.md": '---\nname: "+++"\ndescription: has desc\n---\n' }),
      ),
    ).toThrow(/valid slug/);
  });
});

describe("agentLabel", () => {
  it("returns the filename stem", () => {
    expect(agentLabel("agents/My Helper.md")).toBe("My Helper");
  });
});
