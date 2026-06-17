import { unzipSync } from "fflate";

import { UploadRejectedError } from "./errors";
import { UPLOAD_LIMITS } from "./limits";

// ZIP record signatures (little-endian) and the central-directory field layout
// we read. We parse the central directory ourselves — rather than trusting
// fflate's decompressed output — so every security ceiling and the symlink
// check are enforced *before* a single byte is inflated (the zip-bomb guard).
const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_DIR_SIGNATURE = 0x02014b50;
const EOCD_MIN_SIZE = 22;
const MAX_COMMENT_SIZE = 0xffff;

const EOCD_TOTAL_ENTRIES_OFFSET = 10;
const EOCD_CENTRAL_DIR_OFFSET_OFFSET = 16;

const CD_EXTERNAL_ATTRS_OFFSET = 38;
const CD_FILENAME_LENGTH_OFFSET = 28;
const CD_EXTRA_LENGTH_OFFSET = 30;
const CD_COMMENT_LENGTH_OFFSET = 32;
const CD_UNCOMPRESSED_SIZE_OFFSET = 24;
const CD_FIXED_HEADER_SIZE = 46;
const CD_FILENAME_OFFSET = 46;

// Unix mode lives in the high 16 bits of the external attributes; S_IFLNK marks
// a symlink. Stored only when the archive carries Unix permissions, so MS-DOS
// archives (high bits zero) never false-positive.
const UNIX_MODE_SHIFT = 16;
const S_IFMT = 0xf000;
const S_IFLNK = 0xa000;

type CentralEntry = {
  name: string;
  uncompressedSize: number;
  isSymlink: boolean;
};

/** A directory entry is just a name terminator, never a stored file. */
function isDirectory(name: string): boolean {
  return name.endsWith("/");
}

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

function findEndOfCentralDirectory(view: DataView, bytes: Uint8Array): number {
  // The EOCD sits at the end, possibly behind a comment up to 64 KiB. Scan back
  // from the latest position it could occupy until the signature matches.
  const earliest = Math.max(0, bytes.length - EOCD_MIN_SIZE - MAX_COMMENT_SIZE);
  for (let offset = bytes.length - EOCD_MIN_SIZE; offset >= earliest; offset--) {
    if (view.getUint32(offset, true) === EOCD_SIGNATURE) {
      return offset;
    }
  }
  throw new UploadRejectedError("invalid-zip", "The file is not a valid zip archive.");
}

function readCentralDirectory(bytes: Uint8Array): CentralEntry[] {
  if (bytes.length < EOCD_MIN_SIZE) {
    throw new UploadRejectedError("invalid-zip", "The file is not a valid zip archive.");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = findEndOfCentralDirectory(view, bytes);
  const totalEntries = view.getUint16(eocd + EOCD_TOTAL_ENTRIES_OFFSET, true);
  let cursor = view.getUint32(eocd + EOCD_CENTRAL_DIR_OFFSET_OFFSET, true);

  const decoder = new TextDecoder();
  const entries: CentralEntry[] = [];
  for (let index = 0; index < totalEntries; index++) {
    if (cursor + CD_FIXED_HEADER_SIZE > bytes.length) {
      throw new UploadRejectedError("invalid-zip", "The zip's central directory is truncated.");
    }
    if (view.getUint32(cursor, true) !== CENTRAL_DIR_SIGNATURE) {
      throw new UploadRejectedError("invalid-zip", "The zip's central directory is corrupt.");
    }

    const nameLength = view.getUint16(cursor + CD_FILENAME_LENGTH_OFFSET, true);
    const extraLength = view.getUint16(cursor + CD_EXTRA_LENGTH_OFFSET, true);
    const commentLength = view.getUint16(cursor + CD_COMMENT_LENGTH_OFFSET, true);
    const uncompressedSize = view.getUint32(cursor + CD_UNCOMPRESSED_SIZE_OFFSET, true);
    const externalAttrs = view.getUint32(cursor + CD_EXTERNAL_ATTRS_OFFSET, true);
    const unixMode = (externalAttrs >>> UNIX_MODE_SHIFT) & S_IFMT;

    const nameStart = cursor + CD_FILENAME_OFFSET;
    const name = decoder.decode(bytes.subarray(nameStart, nameStart + nameLength));

    entries.push({ name, uncompressedSize, isSymlink: unixMode === S_IFLNK });
    cursor = nameStart + nameLength + extraLength + commentLength;
  }

  return entries;
}

function enforceLimits(entries: CentralEntry[]): void {
  const files = entries.filter((entry) => !isDirectory(entry.name));

  if (files.length > UPLOAD_LIMITS.maxFiles) {
    throw new UploadRejectedError(
      "too-many-files",
      `The archive has too many files (limit ${UPLOAD_LIMITS.maxFiles}).`,
    );
  }

  let totalUncompressed = 0;
  for (const entry of files) {
    if (entry.isSymlink) {
      throw new UploadRejectedError("symlink", `Symlinks are not allowed: ${entry.name}`);
    }
    if (isUnsafePath(entry.name)) {
      throw new UploadRejectedError("unsafe-path", `Unsafe path in archive: ${entry.name}`);
    }
    if (entry.uncompressedSize > UPLOAD_LIMITS.maxFileBytes) {
      throw new UploadRejectedError("file-too-large", `File too large: ${entry.name}`);
    }
    totalUncompressed += entry.uncompressedSize;
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

  // Pre-flight on the central directory: rejecting here means a zip bomb is
  // turned away before fflate inflates anything.
  enforceLimits(readCentralDirectory(bytes));

  let unzipped: Record<string, Uint8Array>;
  try {
    unzipped = unzipSync(bytes, { filter: (file) => !isDirectory(file.name) });
  } catch {
    throw new UploadRejectedError("invalid-zip", "The archive could not be read.");
  }

  return new Map(Object.entries(unzipped));
}
