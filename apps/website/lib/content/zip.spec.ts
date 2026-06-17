// @vitest-environment node
import AdmZip from "adm-zip";
import { describe, expect, it } from "vitest";

import { UploadRejectedError } from "./errors";
import { UPLOAD_LIMITS } from "./limits";
import { isUnsafePath, unzipSafely } from "./zip";

// External attribute carrying a Unix symlink mode (S_IFLNK | 0777) in its high
// 16 bits — the bit pattern unzipSafely treats as a symlink.
const SYMLINK_ATTR = (0o120777 << 16) >>> 0;

type FixtureEntry = { data?: Buffer; name?: string; symlink?: boolean };

const text = (value: string) => Buffer.from(value);

// adm-zip's addFile sanitises `..`/leading-slash names, so unsafe paths are set
// directly on the entry to reproduce what a malicious archive would carry.
function zip(entries: Record<string, FixtureEntry>): Uint8Array {
  const archive = new AdmZip();
  let index = 0;
  for (const [key, entry] of Object.entries(entries)) {
    const created = archive.addFile(`placeholder-${index++}`, entry.data ?? text("x"));
    created.entryName = entry.name ?? key;
    if (entry.symlink) {
      created.attr = SYMLINK_ATTR;
    }
  }
  return archive.toBuffer();
}

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
  it("returns regular files keyed by path", () => {
    const files = unzipSafely(
      zip({
        "skills/demo/SKILL.md": { data: text("hello") },
        "skills/demo/scripts/run.sh": { data: text("echo") },
      }),
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
    const error = rejectionReason(() => unzipSafely(zip({ escape: { name: "../escape.txt" } })));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("unsafe-path");
  });

  it("rejects an absolute-path entry", () => {
    const error = rejectionReason(() => unzipSafely(zip({ passwd: { name: "/etc/passwd" } })));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("unsafe-path");
  });

  it("rejects a symlink entry", () => {
    const error = rejectionReason(() =>
      unzipSafely(zip({ "skills/demo/link": { data: text("/etc/passwd"), symlink: true } })),
    );
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("symlink");
  });

  it("rejects an archive with too many files", () => {
    const entries: Record<string, FixtureEntry> = {};
    for (let index = 0; index <= UPLOAD_LIMITS.maxFiles; index++) {
      entries[`skills/demo/file-${index}.txt`] = { data: text("x") };
    }
    const error = rejectionReason(() => unzipSafely(zip(entries)));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("too-many-files");
  });

  it("rejects a single file over the per-file ceiling", () => {
    const big = Buffer.alloc(UPLOAD_LIMITS.maxFileBytes + 1);
    const error = rejectionReason(() => unzipSafely(zip({ "skills/demo/big.bin": { data: big } })));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("file-too-large");
  });

  it("rejects an archive whose uncompressed size exceeds the ceiling (zip bomb)", () => {
    // Each file sits at the per-file ceiling; enough of them to clear the
    // uncompressed total. Highly compressible, so the archive stays tiny.
    const entries: Record<string, FixtureEntry> = {};
    const fileCount = Math.ceil(UPLOAD_LIMITS.maxUncompressedBytes / UPLOAD_LIMITS.maxFileBytes) + 1;
    for (let index = 0; index < fileCount; index++) {
      entries[`skills/demo/file-${index}.bin`] = { data: Buffer.alloc(UPLOAD_LIMITS.maxFileBytes) };
    }
    const error = rejectionReason(() => unzipSafely(zip(entries)));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("uncompressed-too-large");
  });

  it("rejects a file that is not a zip", () => {
    const error = rejectionReason(() => unzipSafely(new Uint8Array(text("not a zip at all"))));
    expect(error).toBeInstanceOf(UploadRejectedError);
    expect((error as UploadRejectedError).reason).toBe("invalid-zip");
  });
});
