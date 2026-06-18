import type { ManifestEntry, UploadResult } from "@/db/schema";
import { blobKey, type BlobStorage } from "@/lib/storage/blob";

import type { ParsedAgent } from "./agents";
import { failureMessage, UploadRejectedError } from "./errors";
import { dedupeItems, discoverItems, type ParsedItem } from "./items";
import type { ParsedSkill } from "./skills";
import { unzipSafely } from "./zip";

// Uploaded blobs carry no active content type — they are inert files served as
// downloads. The storage layer additionally forces a download disposition.
const INERT_CONTENT_TYPE = "application/octet-stream";
const FIRST_VERSION = 1;

/** Everything needed to persist one item's first version atomically. */
export type ContentVersionRecord = {
  type: "skill" | "agent";
  contentId: string;
  versionId: string;
  ownerId: string;
  /** Slugified name — identity, slug, and canonical name all at once. */
  slug: string;
  description: string;
  /** Inline markdown for agents; omitted for skills. */
  body?: string;
  /** Blob references for skills; omitted for agents. */
  manifest?: ManifestEntry[];
};

/**
 * Side-effecting collaborators for {@link processUpload}, injected so the
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
  saveContentVersion: (record: ContentVersionRecord) => Promise<void>;
  /** Update the audit row with the results gathered so far (progress + final state). */
  updateUploadRequest: (batchId: string, results: UploadResult[]) => Promise<void>;
};

// Unzipped entries are plain `Uint8Array`s; the blob API wants the
// `ArrayBuffer`-backed variant, which they always are.
function asBytes(data: Uint8Array): Uint8Array<ArrayBuffer> {
  return data as Uint8Array<ArrayBuffer>;
}

// Import one skill without throwing: write its files to blob storage first so the
// version row can reference them, then commit. Any failure (a bad blob write or
// the DB) becomes a `failed` result, and the blobs written so far are dropped so
// nothing half-imported is left behind.
async function importSkill(
  ownerId: string,
  skill: ParsedSkill,
  store: UploadStore,
): Promise<UploadResult> {
  const contentId = store.newId();
  const versionId = store.newId();
  const manifest: ManifestEntry[] = [];
  const writtenKeys: string[] = [];

  try {
    for (const file of skill.files) {
      const key = blobKey(contentId, versionId, file.relpath);
      await store.storage.put(key, asBytes(file.data), INERT_CONTENT_TYPE);
      writtenKeys.push(key);
      manifest.push({ path: file.relpath, blobKey: key, size: file.data.byteLength });
    }
    await store.saveContentVersion({
      type: "skill",
      contentId,
      versionId,
      ownerId,
      slug: skill.slug,
      description: skill.description,
      manifest,
    });
    return { type: "skill", name: skill.slug, status: "created", contentId };
  } catch (error) {
    // Best-effort: drop the orphaned blobs so a failed import is fully undone.
    await Promise.allSettled(writtenKeys.map((key) => store.storage.delete(key)));
    return { type: "skill", name: skill.slug, status: "failed", message: failureMessage(error) };
  }
}

// Import one agent without throwing. Agents are a single markdown file stored
// inline on the version, so there are no blobs to write or clean up.
async function importAgent(
  ownerId: string,
  agent: ParsedAgent,
  store: UploadStore,
): Promise<UploadResult> {
  const contentId = store.newId();
  const versionId = store.newId();

  try {
    await store.saveContentVersion({
      type: "agent",
      contentId,
      versionId,
      ownerId,
      slug: agent.slug,
      description: agent.description,
      body: agent.body,
    });
    return { type: "agent", name: agent.slug, status: "created", contentId };
  } catch (error) {
    return { type: "agent", name: agent.slug, status: "failed", message: failureMessage(error) };
  }
}

function importItem(ownerId: string, item: ParsedItem, store: UploadStore): Promise<UploadResult> {
  return item.type === "skill"
    ? importSkill(ownerId, item, store)
    : importAgent(ownerId, item, store);
}

/**
 * Process an upload end to end. The archive is validated and inflated first (a
 * corrupt zip, or one with no valid skills and no valid agents, is rejected
 * before anything is persisted — a zip-level failure that keeps the user on the
 * form). Otherwise the upload_request audit row is committed up front and each
 * valid item is imported in its own transaction, so a per-item failure (parse
 * error, in-zip duplicate, or DB error) is reported but never blocks the others.
 * Ignored junk is counted and surfaced too. Returns the upload_request id (the
 * batch id). Throws {@link UploadRejectedError} only for a zip-level failure.
 */
export async function processUpload(
  ownerId: string,
  archive: Uint8Array,
  store: UploadStore,
): Promise<string> {
  const files = unzipSafely(archive);
  const { items: parsed, failures, ignored } = discoverItems(files);

  if (parsed.length === 0) {
    throw new UploadRejectedError(
      "no-content",
      "The archive does not contain a valid skill or agent.",
    );
  }

  const { unique, duplicates } = dedupeItems(parsed);

  // The audit row is committed before any item is processed, so a crash
  // mid-batch still leaves a discoverable record rather than orphaned rows.
  const batchId = await store.createUploadRequest(ownerId, parsed.length + failures.length);

  // Parse failures, in-zip duplicates, and ignored files are known up front;
  // persist them immediately so the summary is complete even if no item imports.
  const results: UploadResult[] = [
    ...failures,
    ...duplicates,
    ...ignored.map((path): UploadResult => ({ name: path, status: "ignored" })),
  ];
  await store.updateUploadRequest(batchId, results);

  for (const item of unique) {
    results.push(await importItem(ownerId, item, store));
    await store.updateUploadRequest(batchId, results);
  }

  return batchId;
}

export { FIRST_VERSION };
