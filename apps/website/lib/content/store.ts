import { eq } from "drizzle-orm";

import { db } from "@/db";
import { content, contentVersion, uploadRequest, type UploadResult } from "@/db/schema";
import { azureBlobStorageFromEnv } from "@/lib/storage/azure";

import { UploadRejectedError } from "./errors";
import { FIRST_VERSION, type UploadStore } from "./upload";

const isSuccess = (result: UploadResult) =>
  result.status === "created" || result.status === "updated";

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

    async saveSkillVersion(record) {
      try {
        await db.transaction(async (tx) => {
          await tx.insert(content).values({
            id: record.contentId,
            ownerId: record.ownerId,
            type: "skill",
            name: record.slug,
            description: record.description,
          });
          await tx.insert(contentVersion).values({
            id: record.versionId,
            contentId: record.contentId,
            version: FIRST_VERSION,
            description: record.description,
            manifest: record.manifest,
          });
          await tx
            .update(content)
            .set({ latestVersionId: record.versionId })
            .where(eq(content.id, record.contentId));
        });
      } catch (error) {
        // Surface a duplicate name as a clean rejection (the caller cleans up the
        // blobs); anything else is unexpected and propagates as a 500.
        if (isUniqueViolation(error)) {
          throw new UploadRejectedError(
            "duplicate-name",
            `You already have a skill named "${record.slug}".`,
          );
        }
        throw error;
      }
    },

    async saveUploadRequest(ownerId, results) {
      const id = crypto.randomUUID();
      const successCount = results.filter(isSuccess).length;
      await db.insert(uploadRequest).values({
        id,
        ownerId,
        totalCount: results.length,
        successCount,
        failureCount: results.length - successCount,
        results,
      });
      return id;
    },
  };
}
