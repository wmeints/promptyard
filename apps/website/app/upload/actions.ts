"use server";

import { redirect } from "next/navigation";

import { UploadRejectedError } from "@/lib/content/errors";
import { createUploadStore } from "@/lib/content/store";
import { processUpload } from "@/lib/content/upload";
import { getCurrentSession } from "@/lib/session";

export type UploadState = { error?: string };

/**
 * Server action behind the /upload drop-zone. Auth-gated, reads the posted zip,
 * imports its skills, and redirects to the persisted summary at
 * `/upload/<batchId>`. Returns an error message for an archive the user can fix;
 * unexpected failures propagate to the route's error boundary.
 */
export async function uploadSkill(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/upload");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a .zip file to upload." };
  }

  const archive = new Uint8Array(await file.arrayBuffer());

  let batchId: string;
  try {
    batchId = await processUpload(session.user.id, archive, createUploadStore());
  } catch (error) {
    if (error instanceof UploadRejectedError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect(`/upload/${batchId}`);
}
