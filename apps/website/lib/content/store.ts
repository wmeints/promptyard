import { eq } from "drizzle-orm";

import { db } from "@/db";
import { content, contentVersion, uploadRequest, type UploadResult } from "@/db/schema";
import { azureBlobStorageFromEnv } from "@/lib/storage/azure";

import { UploadRejectedError } from "./errors";
import { FIRST_VERSION, type UploadStore } from "./upload";

const isSuccess = (result: UploadResult) =>
  result.status === "created" || result.status === "updated";

// Ignored entries (junk, out-of-scope files) are recorded for the summary but
// are neither successes nor failures, so they stay out of both audit counts.
const isFailure = (result: UploadResult) => result.status === "failed";

// PostgreSQL `unique_violation`. The `(owner, type, name)` constraint fires when
// a skill of this name already exists — re-upload/versioning is a later slice.
const UNIQUE_VIOLATION = "23505";

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === UNIQUE_VIOLATION
  );
}

/**
 * The production {@link UploadStore}: Azure for blobs, Drizzle for rows. Kept
 * thin so the upload orchestration (and all its branching) stays unit-testable
 * with fakes while this glue is covered by the build and integration.
 */
export function createUploadStore(): UploadStore {
  return {
    storage: azureBlobStorageFromEnv(),
    newId: () => crypto.randomUUID(),

    async createUploadRequest(ownerId, totalCount) {
      const id = crypto.randomUUID();
      await db.insert(uploadRequest).values({ id, ownerId, totalCount });
      return id;
    },

    async saveContentVersion(record) {
      try {
        await db.transaction(async (tx) => {
          await tx.insert(content).values({
            id: record.contentId,
            ownerId: record.ownerId,
            type: record.type,
            name: record.slug,
            description: record.description,
          });
          await tx.insert(contentVersion).values({
            id: record.versionId,
            contentId: record.contentId,
            version: FIRST_VERSION,
            description: record.description,
            body: record.body,
            manifest: record.manifest,
          });
          await tx
            .update(content)
            .set({ latestVersionId: record.versionId })
            .where(eq(content.id, record.contentId));
        });
      } catch (error) {
        // Map a duplicate name to a clean, user-facing rejection; the caller
        // records it as a failed item (with a generic message for anything else)
        // and cleans up any just-written blobs.
        if (isUniqueViolation(error)) {
          throw new UploadRejectedError(
            "duplicate-name",
            `You already have ${record.type === "agent" ? "an agent" : "a skill"} named "${record.slug}".`,
          );
        }
        throw error;
      }
    },

    async updateUploadRequest(batchId, results) {
      await db
        .update(uploadRequest)
        .set({
          successCount: results.filter(isSuccess).length,
          failureCount: results.filter(isFailure).length,
          results,
        })
        .where(eq(uploadRequest.id, batchId));
    },
  };
}
