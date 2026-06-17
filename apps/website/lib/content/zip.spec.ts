import { zipSync, type ZipAttributes } from "fflate";
import { describe, expect, it } from "vitest";

import { UploadRejectedError } from "./errors";
import { UPLOAD_LIMITS } from "./limits";
import { isUnsafePath, unzipSafely } from "./zip";

type Entry = Uint8Array | [Uint8Array, ZipAttributes];

function zip(entries: Record<string, Entry>): Uint8Array {
  return zipSync(entries);
}

const text = (value: string) => new TextEncoder().encode(value);

// Unix mode for a symlink (S_IFLNK | 0777) lives in the high 16 bits of the
// external attributes; `os: 3` (Unix) is required for it to be written.
const SYMLINK_ATTRS: ZipAttributes = { os: 3, attrs: 0o120777 << 16 };

function rejectionReason(run: () => void): unknown {
  try {
    run();
  } catch (error) {
    return error;
  }
  return undefined;
}

describe("isUnsafePath", () => {
  it.each([
    "../escape.txt",
    "skills/../../escape.txt",
    "/etc/passwd",
    "\\windows\\system32",
    "C:\\secrets.txt",
    "skills\\..\\escape",
  ])("flags %s as unsafe", (name) => {
    expect(isUnsafePath(name)).toBe(true);
  });

  it.each(["skills/demo/SKILL.md", "skills/demo/scripts/run.sh", "a..b/file.md"])(
    "treats %s as safe",
    (name) => {
      expect(isUnsafePath(name)).toBe(false);
    },
  );
});

describe("unzipSafely", () => {
  it("returns regular files keyed by path and drops directory entries", () => {
    const files = unzipSafely(
      zip({ "skills/demo/SKILL.md": text("hello"), "skills/demo/scripts/run.sh": text("echo") }),
    );

    expect([...files.keys()].sort()).toEqual([
      "skills/demo/SKILL.md",
      "skills/demo/scripts/run.sh",
    ]);
    expect(new TextDecoder().decode(files.get("skills/demo/SKILL.md"))).toBe("hello");
  });

  it("rejects an archive larger than the compressed ceiling without parsing it", () => {
    const tooBig = new Uint8Array(UPLOAD_LIMITS.maxCompressedBytes + 1);
    const error = rejectionReason(() => unzipSafely(tooBig));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("compressed-too-large");
  });

  it("rejects a path-traversal entry", () => {
    const error = rejectionReason(() => unzipSafely(zip({ "../escape.txt": text("x") })));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("unsafe-path");
  });

  it("rejects an absolute-path entry", () => {
    const error = rejectionReason(() => unzipSafely(zip({ "/etc/passwd": text("x") })));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("unsafe-path");
  });

  it("rejects a symlink entry", () => {
    const error = rejectionReason(() =>
      unzipSafely(zip({ "skills/demo/link": [text("/etc/passwd"), SYMLINK_ATTRS] })),
    );
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("symlink");
  });

  it("rejects an archive with too many files", () => {
    const entries: Record<string, Entry> = {};
    for (let index = 0; index <= UPLOAD_LIMITS.maxFiles; index++) {
      entries[`skills/demo/file-${index}.txt`] = text("x");
    }
    const error = rejectionReason(() => unzipSafely(zip(entries)));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("too-many-files");
  });

  it("rejects a single file over the per-file ceiling", () => {
    const big = new Uint8Array(UPLOAD_LIMITS.maxFileBytes + 1);
    const error = rejectionReason(() => unzipSafely(zip({ "skills/demo/big.bin": big })));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("file-too-large");
  });

  it("rejects an archive whose uncompressed size exceeds the ceiling (zip bomb)", () => {
    // Each file sits at the per-file ceiling; enough of them to clear the
    // uncompressed total. Highly compressible, so the archive stays tiny.
    const entries: Record<string, Entry> = {};
    const fileCount = Math.ceil(UPLOAD_LIMITS.maxUncompressedBytes / UPLOAD_LIMITS.maxFileBytes) + 1;
    for (let index = 0; index < fileCount; index++) {
      entries[`skills/demo/file-${index}.bin`] = new Uint8Array(UPLOAD_LIMITS.maxFileBytes);
    }
    const error = rejectionReason(() => unzipSafely(zip(entries)));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("uncompressed-too-large");
  });

  it("rejects a file that is not a zip", () => {
    const error = rejectionReason(() => unzipSafely(text("not a zip at all")));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("invalid-zip");
  });
});
