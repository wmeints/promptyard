import type { ManifestEntry, UploadResult } from "@/db/schema";
import { blobKey, type BlobStorage } from "@/lib/storage/blob";

import { extractSkills, type ParsedSkill } from "./skills";
import { unzipSafely } from "./zip";

// Uploaded blobs carry no active content type — they are inert files served as
// downloads. The storage layer additionally forces a download disposition.
const INERT_CONTENT_TYPE = "application/octet-stream";
const FIRST_VERSION = 1;

/** Everything needed to persist one skill's first version atomically. */
export type SkillVersionRecord = {
  contentId: string;
  versionId: string;
  ownerId: string;
  /** Slugified name — identity, slug, and canonical name all at once. */
  slug: string;
  description: string;
  manifest: ManifestEntry[];
};

/**
 * Side-effecting collaborators for {@link processSkillUpload}, injected so the
 * orchestration can be unit-tested without Azure or a database. The real
 * implementation lives in `./store`.
 */
export type UploadStore = {
  storage: BlobStorage;
  /** Generate a fresh id; injectable so tests stay deterministic. */
  newId: () => string;
  /** Persist content + content_version (v1) atomically and set latestVersionId. */
  saveSkillVersion: (record: SkillVersionRecord) => Promise<void>;
  /** Persist the upload_request audit row and return its id (the batch id). */
  saveUploadRequest: (ownerId: string, results: UploadResult[]) => Promise<string>;
};

// fflate inflates into plain `Uint8Array`s; the blob API wants the
// `ArrayBuffer`-backed variant, which they always are.
function asBytes(data: Uint8Array): Uint8Array<ArrayBuffer> {
  return data as Uint8Array<ArrayBuffer>;
}

async function importSkill(
  ownerId: string,
  skill: ParsedSkill,
  store: UploadStore,
): Promise<UploadResult> {
  const contentId = store.newId();
  const versionId = store.newId();

  // Files go to blob storage first so the version row can reference them. Track
  // what we wrote so a later DB failure leaves nothing half-imported behind.
  const manifest: ManifestEntry[] = [];
  const writtenKeys: string[] = [];
  for (const file of skill.files) {
    const key = blobKey(contentId, versionId, file.relpath);
    await store.storage.put(key, asBytes(file.data), INERT_CONTENT_TYPE);
    writtenKeys.push(key);
    manifest.push({ path: file.relpath, blobKey: key, size: file.data.byteLength });
  }

  try {
    await store.saveSkillVersion({
      contentId,
      versionId,
      ownerId,
      slug: skill.slug,
      description: skill.description,
      manifest,
    });
  } catch (error) {
    // Best-effort: drop the orphaned blobs so a failed import is fully undone.
    await Promise.allSettled(writtenKeys.map((key) => store.storage.delete(key)));
    throw error;
  }

  return { type: "skill", name: skill.slug, status: "created", contentId };
}

/**
 * Process a skill upload end to end: validate and inflate the archive, import
 * each skill (blobs then a transactional content + version row), and persist an
 * upload_request audit row. Returns the upload_request id (the batch id) for the
 * summary redirect. Throws {@link ./errors.UploadRejectedError} for a bad
 * archive, or rethrows a storage/DB error after cleaning up written blobs.
 */
export async function processSkillUpload(
  ownerId: string,
  archive: Uint8Array,
  store: UploadStore,
): Promise<string> {
  const skills = extractSkills(unzipSafely(archive));

  const results: UploadResult[] = [];
  for (const skill of skills) {
    results.push(await importSkill(ownerId, skill, store));
  }

  return store.saveUploadRequest(ownerId, results);
}

export { FIRST_VERSION };
