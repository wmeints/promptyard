const BYTES_PER_MB = 1024 * 1024;

/**
 * Security ceilings for a single upload. A public upload endpoint cannot ship
 * without these: they bound memory use, cap zip-bomb amplification, and keep a
 * worst-case archive within the synchronous request budget. Enforced in
 * {@link ../content/zip.unzipSafely} before any decompression happens.
 */
export const UPLOAD_LIMITS = {
  /** Largest accepted compressed archive (matches the server-action body cap). */
  maxCompressedBytes: 10 * BYTES_PER_MB,
  /** Largest accepted total uncompressed size — the zip-bomb guard. */
  maxUncompressedBytes: 50 * BYTES_PER_MB,
  /** Largest number of entries in a single archive. */
  maxFiles: 500,
  /** Largest accepted single uncompressed file. */
  maxFileBytes: 2 * BYTES_PER_MB,
} as const;
