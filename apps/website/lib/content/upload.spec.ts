// @vitest-environment node
import AdmZip from "adm-zip";
import { describe, expect, it, vi } from "vitest";

import type { UploadResult } from "@/db/schema";
import type { BlobStorage } from "@/lib/storage/blob";

import { UploadRejectedError } from "./errors";
import { processUpload, type UploadStore } from "./upload";

type SkillSpec = { folder: string; manifest: string; extra?: Record<string, string> };

const manifest = (name: string, description: string) =>
  `---\nname: ${name}\ndescription: ${description}\n---\nBody`;

function zipFrom(entries: Record<string, string>): Uint8Array {
  const zip = new AdmZip();
  for (const [path, body] of Object.entries(entries)) {
    zip.addFile(path, Buffer.from(body));
  }
  return new Uint8Array(zip.toBuffer());
}

function skillZip(...skills: SkillSpec[]): Uint8Array {
  const entries: Record<string, string> = {};
  for (const skill of skills) {
    entries[`skills/${skill.folder}/SKILL.md`] = skill.manifest;
    for (const [relpath, body] of Object.entries(skill.extra ?? {})) {
      entries[`skills/${skill.folder}/${relpath}`] = body;
    }
  }
  return zipFrom(entries);
}

function fakeStore(overrides: Partial<UploadStore> = {}): UploadStore {
  let counter = 0;
  return {
    storage: {
      put: vi.fn<BlobStorage["put"]>(async () => {}),
      get: vi.fn<BlobStorage["get"]>(async () => new Uint8Array()),
      delete: vi.fn<BlobStorage["delete"]>(async () => {}),
    },
    newId: vi.fn<() => string>(() => `id-${++counter}`),
    createUploadRequest: vi.fn<UploadStore["createUploadRequest"]>(async () => "batch-1"),
    saveContentVersion: vi.fn<UploadStore["saveContentVersion"]>(async () => {}),
    updateUploadRequest: vi.fn<UploadStore["updateUploadRequest"]>(async () => {}),
    ...overrides,
  };
}

const lastResults = (store: UploadStore): UploadResult[] =>
  vi.mocked(store.updateUploadRequest).mock.lastCall?.[1] ?? [];

describe("processUpload", () => {
  it("creates the audit row up front, writes blobs, and records a created result", async () => {
    const store = fakeStore();

    const batchId = await processUpload(
      "owner-1",
      skillZip({
        folder: "My Demo",
        manifest: manifest("My Demo", "A demo skill"),
        extra: { "scripts/run.sh": "echo hi" },
      }),
      store,
    );

    expect(batchId).toBe("batch-1");
    expect(store.createUploadRequest).toHaveBeenCalledWith("owner-1", 1);
    // The audit row is created before any item is persisted.
    expect(vi.mocked(store.createUploadRequest).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(store.saveContentVersion).mock.invocationCallOrder[0],
    );
    expect(store.storage.put).toHaveBeenCalledTimes(2);
    expect(lastResults(store)).toEqual([
      { type: "skill", name: "my-demo", status: "created", contentId: "id-1" },
    ]);
  });

  it("imports an agent inline without writing any blobs", async () => {
    const store = fakeStore();

    await processUpload(
      "owner-1",
      zipFrom({ "agents/helper.md": manifest("Helper", "An agent") }),
      store,
    );

    expect(store.storage.put).not.toHaveBeenCalled();
    expect(store.saveContentVersion).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "agent",
        slug: "helper",
        body: expect.stringContaining("Helper"),
      }),
    );
    expect(lastResults(store)).toEqual([
      { type: "agent", name: "helper", status: "created", contentId: "id-1" },
    ]);
  });

  it("imports skills and agents from one archive", async () => {
    const store = fakeStore();

    await processUpload(
      "owner-1",
      zipFrom({
        "skills/demo/SKILL.md": manifest("Demo", "a skill"),
        "agents/helper.md": manifest("Helper", "an agent"),
      }),
      store,
    );

    expect(store.createUploadRequest).toHaveBeenCalledWith("owner-1", 2);
    expect(lastResults(store)).toEqual([
      { type: "skill", name: "demo", status: "created", contentId: "id-1" },
      { type: "agent", name: "helper", status: "created", contentId: "id-3" },
    ]);
  });

  it("continues past a failing item, recording it as failed and cleaning up its blobs", async () => {
    const store = fakeStore({
      saveContentVersion: vi.fn<UploadStore["saveContentVersion"]>(async (record) => {
        if (record.slug === "bravo") {
          throw new UploadRejectedError(
            "duplicate-name",
            'You already have a skill named "bravo".',
          );
        }
      }),
    });

    await processUpload(
      "owner-1",
      skillZip(
        { folder: "alpha", manifest: manifest("alpha", "first") },
        { folder: "bravo", manifest: manifest("bravo", "second") },
      ),
      store,
    );

    // bravo's just-written blob is cleaned up; alpha's is not.
    expect(store.storage.delete).toHaveBeenCalledTimes(1);
    expect(lastResults(store)).toEqual([
      { type: "skill", name: "alpha", status: "created", contentId: "id-1" },
      {
        type: "skill",
        name: "bravo",
        status: "failed",
        message: 'You already have a skill named "bravo".',
      },
    ]);
  });

  it("records a malformed item as failed without writing blobs for it", async () => {
    const store = fakeStore();

    await processUpload(
      "owner-1",
      skillZip(
        { folder: "good", manifest: manifest("good", "valid") },
        { folder: "bad", manifest: "---\nname: Bad\n---\nNo description" },
      ),
      store,
    );

    const results = lastResults(store);
    expect(results).toContainEqual(expect.objectContaining({ name: "bad", status: "failed" }));
    expect(results).toContainEqual(expect.objectContaining({ name: "good", status: "created" }));
    // Only the good skill's SKILL.md is written; the bad one never reaches storage.
    expect(store.storage.put).toHaveBeenCalledTimes(1);
  });

  it("rejects an in-zip duplicate pair while still importing other items", async () => {
    const store = fakeStore();

    await processUpload(
      "owner-1",
      zipFrom({
        "skills/one/SKILL.md": manifest("Dup", "first"),
        "skills/two/SKILL.md": manifest("Dup", "second"),
        "skills/solo/SKILL.md": manifest("Solo", "only one"),
      }),
      store,
    );

    const results = lastResults(store);
    expect(results.filter((r) => r.name === "dup")).toEqual([
      { type: "skill", name: "dup", status: "failed", message: expect.any(String) },
      { type: "skill", name: "dup", status: "failed", message: expect.any(String) },
    ]);
    expect(results).toContainEqual(expect.objectContaining({ name: "solo", status: "created" }));
    // Neither duplicate is persisted; only solo is.
    expect(store.saveContentVersion).toHaveBeenCalledTimes(1);
  });

  it("counts ignored junk and out-of-scope files in the summary", async () => {
    const store = fakeStore();

    await processUpload(
      "owner-1",
      zipFrom({
        "skills/demo/SKILL.md": manifest("Demo", "a skill"),
        "skills/demo/.DS_Store": "junk",
        "README.md": "top-level doc",
      }),
      store,
    );

    const ignored = lastResults(store).filter((r) => r.status === "ignored");
    expect(ignored.map((r) => r.name)).toEqual(["README.md", "skills/demo/.DS_Store"]);
  });

  it("aborts an archive with no valid skills or agents before creating an audit row", async () => {
    const store = fakeStore();
    const junkOnly = zipFrom({ "README.md": "nothing importable here" });

    await expect(processUpload("owner-1", junkOnly, store)).rejects.toBeInstanceOf(
      UploadRejectedError,
    );
    expect(store.createUploadRequest).not.toHaveBeenCalled();
  });
});
