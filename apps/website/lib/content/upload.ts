import type { ManifestEntry, UploadResult } from "@/db/schema";
import { blobKey, type BlobStorage } from "@/lib/storage/blob";

import { UploadRejectedError } from "./errors";
import { findSkillFolders, parseSkill, type ParsedSkill } from "./skills";
import { unzipSafely } from "./zip";

// Uploaded blobs carry no active content type — they are inert files served as
// downloads. The storage layer additionally forces a download disposition.
const INERT_CONTENT_TYPE = "application/octet-stream";
const FIRST_VERSION = 1;

const ITEM_FAILED_FALLBACK = "Something went wrong importing this item.";

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
  /** Insert the upload_request audit row up front and return its id (the batch id). */
  createUploadRequest: (ownerId: string, totalCount: number) => Promise<string>;
  /** Persist content + content_version (v1) atomically and set latestVersionId. */
  saveSkillVersion: (record: SkillVersionRecord) => Promise<void>;
  /** Update the audit row with the results gathered so far (progress + final state). */
  updateUploadRequest: (batchId: string, results: UploadResult[]) => Promise<void>;
};

// Unzipped entries are plain `Uint8Array`s; the blob API wants the
// `ArrayBuffer`-backed variant, which they always are.
function asBytes(data: Uint8Array): Uint8Array<ArrayBuffer> {
  return data as Uint8Array<ArrayBuffer>;
}

// Only an actionable rejection carries a user-facing message; anything else is
// unexpected and gets a generic one so internals never leak into the summary.
function failureMessage(error: unknown): string {
  return error instanceof UploadRejectedError ? error.message : ITEM_FAILED_FALLBACK;
}

async function importSkillVersion(
  ownerId: string,
  skill: ParsedSkill,
  store: UploadStore,
): Promise<string> {
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

  return contentId;
}

// Process one skill folder end to end without throwing: a parse or import
// failure becomes a `failed` result so the rest of the batch still runs.
async function importSkillFolder(
  ownerId: string,
  folder: string,
  files: Map<string, Uint8Array>,
  store: UploadStore,
): Promise<UploadResult> {
  let skill: ParsedSkill;
  try {
    skill = parseSkill(folder, files);
  } catch (error) {
    return { type: "skill", name: folder, status: "failed", message: failureMessage(error) };
  }

  try {
    const contentId = await importSkillVersion(ownerId, skill, store);
    return { type: "skill", name: skill.slug, status: "created", contentId };
  } catch (error) {
    return { type: "skill", name: skill.slug, status: "failed", message: failureMessage(error) };
  }
}

/**
 * Process a skill upload end to end. Validates and inflates the archive (a bad
 * archive is rejected before anything is persisted), then inserts the
 * upload_request audit row up front and imports each skill, continuing past
 * per-item failures and updating the audit row after each so it always reflects
 * progress and the final state. Returns the upload_request id (the batch id).
 * Throws {@link UploadRejectedError} only for an unusable archive.
 */
export async function processSkillUpload(
  ownerId: string,
  archive: Uint8Array,
  store: UploadStore,
): Promise<string> {
  const files = unzipSafely(archive);
  const folders = findSkillFolders(files);

  // The audit row is committed before any item is processed, so a crash
  // mid-batch still leaves a discoverable record rather than orphaned rows.
  const batchId = await store.createUploadRequest(ownerId, folders.length);

  const results: UploadResult[] = [];
  for (const folder of folders) {
    results.push(await importSkillFolder(ownerId, folder, files, store));
    await store.updateUploadRequest(batchId, results);
  }

  return batchId;
}

export { FIRST_VERSION };
