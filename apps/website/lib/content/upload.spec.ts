import { zipSync } from "fflate";
import { describe, expect, it, vi } from "vitest";

import type { UploadResult } from "@/db/schema";
import type { BlobStorage } from "@/lib/storage/blob";

import { processSkillUpload, type SkillVersionRecord, type UploadStore } from "./upload";

const text = (value: string) => new TextEncoder().encode(value);

const skillZip = () =>
  zipSync({
    "skills/My Demo/SKILL.md": text("---\nname: My Demo\ndescription: A demo skill\n---\nBody"),
    "skills/My Demo/scripts/run.sh": text("echo hi"),
  });

function fakeStore(overrides: Partial<UploadStore> = {}): UploadStore {
  let counter = 0;
  return {
    storage: {
      put: vi.fn<BlobStorage["put"]>(async () => {}),
      get: vi.fn<BlobStorage["get"]>(async () => new Uint8Array()),
      delete: vi.fn<BlobStorage["delete"]>(async () => {}),
    },
    newId: vi.fn<() => string>(() => `id-${++counter}`),
    saveSkillVersion: vi.fn<UploadStore["saveSkillVersion"]>(async () => {}),
    saveUploadRequest: vi.fn<UploadStore["saveUploadRequest"]>(async () => "batch-1"),
    ...overrides,
  };
}

describe("processSkillUpload", () => {
  it("writes one blob per file and persists a transactional version", async () => {
    const store = fakeStore();

    const batchId = await processSkillUpload("owner-1", skillZip(), store);

    expect(batchId).toBe("batch-1");
    expect(store.storage.put).toHaveBeenCalledTimes(2);
    expect(store.storage.put).toHaveBeenCalledWith(
      "content/id-1/id-2/SKILL.md",
      expect.any(Uint8Array),
      "application/octet-stream",
    );

    const record = vi.mocked(store.saveSkillVersion).mock.calls[0][0] as SkillVersionRecord;
    expect(record).toMatchObject({
      ownerId: "owner-1",
      contentId: "id-1",
      versionId: "id-2",
      slug: "my-demo",
      description: "A demo skill",
    });
    expect(record.manifest.map((entry) => entry.path)).toEqual(["SKILL.md", "scripts/run.sh"]);

    const results = vi.mocked(store.saveUploadRequest).mock.calls[0][1] as UploadResult[];
    expect(results).toEqual([
      { type: "skill", name: "my-demo", status: "created", contentId: "id-1" },
    ]);
  });

  it("deletes the just-written blobs when persistence fails", async () => {
    const store = fakeStore({
      saveSkillVersion: vi.fn<UploadStore["saveSkillVersion"]>(async () => {
        throw new Error("db is down");
      }),
    });

    await expect(processSkillUpload("owner-1", skillZip(), store)).rejects.toThrow("db is down");

    expect(store.storage.delete).toHaveBeenCalledTimes(2);
    expect(store.storage.delete).toHaveBeenCalledWith("content/id-1/id-2/SKILL.md");
    expect(store.storage.delete).toHaveBeenCalledWith("content/id-1/id-2/scripts/run.sh");
    expect(store.saveUploadRequest).not.toHaveBeenCalled();
  });
});
