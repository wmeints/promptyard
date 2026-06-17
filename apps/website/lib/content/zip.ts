import AdmZip from "adm-zip";

import { UploadRejectedError } from "./errors";
import { UPLOAD_LIMITS } from "./limits";

// Unix mode lives in the high 16 bits of a zip entry's external attributes;
// S_IFLNK marks a symlink. It is only present when the archive carries Unix
// permissions, so MS-DOS archives (high bits zero) never false-positive.
const UNIX_MODE_SHIFT = 16;
const S_IFMT = 0xf000;
const S_IFLNK = 0xa000;

/**
 * Reject absolute paths and `..` traversal in either slash style. A malicious
 * archive that escapes its folder must never reach blob storage or the filesystem.
 */
export function isUnsafePath(name: string): boolean {
  if (/^([a-zA-Z]:)?[\\/]/.test(name)) {
    return true;
  }
  return name.split(/[\\/]/).some((segment) => segment === "..");
}

function isSymlink(entry: AdmZip.IZipEntry): boolean {
  return ((entry.header.attr >>> UNIX_MODE_SHIFT) & S_IFMT) === S_IFLNK;
}

function readEntries(bytes: Uint8Array): AdmZip.IZipEntry[] {
  try {
    return new AdmZip(Buffer.from(bytes)).getEntries();
  } catch {
    throw new UploadRejectedError("invalid-zip", "The file is not a valid zip archive.");
  }
}

function enforceLimits(files: AdmZip.IZipEntry[]): void {
  if (files.length > UPLOAD_LIMITS.maxFiles) {
    throw new UploadRejectedError(
      "too-many-files",
      `The archive has too many files (limit ${UPLOAD_LIMITS.maxFiles}).`,
    );
  }

  let totalUncompressed = 0;
  for (const entry of files) {
    if (isSymlink(entry)) {
      throw new UploadRejectedError("symlink", `Symlinks are not allowed: ${entry.entryName}`);
    }
    if (isUnsafePath(entry.entryName)) {
      throw new UploadRejectedError("unsafe-path", `Unsafe path in archive: ${entry.entryName}`);
    }
    if (entry.header.size > UPLOAD_LIMITS.maxFileBytes) {
      throw new UploadRejectedError("file-too-large", `File too large: ${entry.entryName}`);
    }
    totalUncompressed += entry.header.size;
  }

  if (totalUncompressed > UPLOAD_LIMITS.maxUncompressedBytes) {
    throw new UploadRejectedError(
      "uncompressed-too-large",
      "The archive's uncompressed size exceeds the limit.",
    );
  }
}

/**
 * Validate every security ceiling against the central directory, then inflate.
 * Returns one entry per regular file, keyed by its archive path. Throws
 * {@link UploadRejectedError} for an oversized, unsafe, or malformed archive.
 */
export function unzipSafely(bytes: Uint8Array): Map<string, Uint8Array> {
  if (bytes.length > UPLOAD_LIMITS.maxCompressedBytes) {
    throw new UploadRejectedError(
      "compressed-too-large",
      "The archive exceeds the 10 MB upload limit.",
    );
  }

  const files = readEntries(bytes).filter((entry) => !entry.isDirectory);

  // Enforce ceilings against the central-directory metadata first, so a zip bomb
  // is turned away before a single entry is inflated.
  enforceLimits(files);

  const result = new Map<string, Uint8Array>();
  for (const entry of files) {
    let data: Buffer;
    try {
      data = entry.getData();
    } catch {
      throw new UploadRejectedError("invalid-zip", "The archive could not be read.");
    }
    // A legitimate entry inflates to its declared size; a mismatch means a header
    // that lied to pass the pre-check, so refuse it.
    if (data.length !== entry.header.size) {
      throw new UploadRejectedError("invalid-zip", `Inconsistent size for ${entry.entryName}.`);
    }
    result.set(entry.entryName, new Uint8Array(data));
  }

  return result;
}
