/**
 * Provider-agnostic blob storage. Business logic depends only on this
 * interface; the concrete provider (Azure today) lives behind a factory so it
 * can be swapped without touching callers. No provider-specific types appear in
 * any signature here.
 */
export interface BlobStorage {
  /** Store `data` at `key`, overwriting any existing blob. */
  put(key: string, data: Uint8Array<ArrayBuffer>, contentType?: string): Promise<void>;
  /** Fetch the blob stored at `key`. Rejects if it does not exist. */
  get(key: string): Promise<Uint8Array<ArrayBuffer>>;
  /** Remove the blob at `key`. Succeeds even if it is already absent. */
  delete(key: string): Promise<void>;
}

/**
 * Build the canonical blob key for a single file of a content version:
 * `content/<contentId>/<versionId>/<relpath>`. Path-based (not content-hashed)
 * so every upload is a fresh version and a whole version is deletable by prefix.
 */
export function blobKey(contentId: string, versionId: string, relpath: string): string {
  const normalizedRelpath = relpath.replace(/^\/+/, "");
  return `content/${contentId}/${versionId}/${normalizedRelpath}`;
}
