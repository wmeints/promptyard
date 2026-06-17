/** Machine-readable reason an upload was refused, for logging and messaging. */
export type RejectReason =
  | "compressed-too-large"
  | "uncompressed-too-large"
  | "too-many-files"
  | "file-too-large"
  | "unsafe-path"
  | "symlink"
  | "invalid-zip"
  | "no-skill"
  | "invalid-frontmatter"
  | "duplicate-name";

/**
 * Thrown when an upload is rejected for a reason the user can act on (oversized,
 * malformed, or unsafe archive). Carries a stable `reason` code so callers can
 * branch or log without string-matching the human-facing `message`.
 */
export class UploadRejectedError extends Error {
  constructor(
    readonly reason: RejectReason,
    message: string,
  ) {
    super(message);
    this.name = "UploadRejectedError";
  }
}
