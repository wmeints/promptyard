// @vitest-environment node
import AdmZip from "adm-zip";
import { describe, expect, it, vi } from "vitest";

import type { UploadResult } from "@/db/schema";
import type { BlobStorage } from "@/lib/storage/blob";

import { UploadRejectedError } from "./errors";
import { processSkillUpload, type UploadStore } from "./upload";

type SkillSpec = { folder: string; manifest: string; extra?: Record<string, string> };

const manifest = (name: string, description: string) =>
  `---\nname: ${name}\ndescription: ${description}\n---\nBody`;

function skillZip(...skills: SkillSpec[]): Uint8Array {
  const zip = new AdmZip();
  for (const skill of skills) {
    zip.addFile(`skills/${skill.folder}/SKILL.md`, Buffer.from(skill.manifest));
    for (const [relpath, body] of Object.entries(skill.extra ?? {})) {
      zip.addFile(`skills/${skill.folder}/${relpath}`, Buffer.from(body));
    }
  }
  return new Uint8Array(zip.toBuffer());
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
    saveSkillVersion: vi.fn<UploadStore["saveSkillVersion"]>(async () => {}),
    updateUploadRequest: vi.fn<UploadStore["updateUploadRequest"]>(async () => {}),
    ...overrides,
  };
}

const lastResults = (store: UploadStore): UploadResult[] =>
  vi.mocked(store.updateUploadRequest).mock.lastCall?.[1] ?? [];

describe("processSkillUpload", () => {
  it("creates the audit row up front, writes blobs, and records a created result", async () => {
    const store = fakeStore();

    const batchId = await processSkillUpload(
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
    // The audit row is created before any skill is persisted.
    expect(vi.mocked(store.createUploadRequest).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(store.saveSkillVersion).mock.invocationCallOrder[0],
    );
    expect(store.storage.put).toHaveBeenCalledTimes(2);
    expect(lastResults(store)).toEqual([
      { type: "skill", name: "my-demo", status: "created", contentId: "id-1" },
    ]);
  });

  it("continues past a failing skill, recording it as failed and cleaning up its blobs", async () => {
    const store = fakeStore({
      saveSkillVersion: vi.fn<UploadStore["saveSkillVersion"]>(async (record) => {
        if (record.slug === "bravo") {
          throw new UploadRejectedError("duplicate-name", 'You already have a skill named "bravo".');
        }
      }),
    });

    const batchId = await processSkillUpload(
      "owner-1",
      skillZip(
        { folder: "alpha", manifest: manifest("alpha", "first") },
        { folder: "bravo", manifest: manifest("bravo", "second") },
      ),
      store,
    );

    expect(batchId).toBe("batch-1");
    expect(store.createUploadRequest).toHaveBeenCalledWith("owner-1", 2);
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

  it("records a skill with invalid frontmatter as failed without writing blobs for it", async () => {
    const store = fakeStore();

    await processSkillUpload(
      "owner-1",
      skillZip(
        { folder: "good", manifest: manifest("good", "valid") },
        { folder: "bad", manifest: "---\nname: Bad\n---\nNo description" },
      ),
      store,
    );

    // Folders are processed in sorted order: "bad" before "good".
    const results = lastResults(store);
    expect(results[0]).toMatchObject({ name: "bad", status: "failed" });
    expect(results[1]).toMatchObject({ name: "good", status: "created" });
    // Only the good skill's SKILL.md is written; the bad one never reaches storage.
    expect(store.storage.put).toHaveBeenCalledTimes(1);
  });

  it("rejects an archive with no skill before creating an audit row", async () => {
    const store = fakeStore();
    const emptyZip = new Uint8Array(new AdmZip().toBuffer());

    await expect(processSkillUpload("owner-1", emptyZip, store)).rejects.toBeInstanceOf(
      UploadRejectedError,
    );
    expect(store.createUploadRequest).not.toHaveBeenCalled();
  });
});
