import type { BlobStorage } from "./blob";

export interface AzureBlobConfig {
  /** Blob endpoint, e.g. `https://myaccount.blob.core.windows.net`. */
  accountUrl: string;
  /** Container that holds all content blobs. */
  container: string;
  /** Shared Access Signature granting read/write/delete on the container. */
  sasToken: string;
}

const HTTP_NOT_FOUND = 404;

// Encode each path segment but keep the `/` separators intact so the blob key's
// directory structure survives in the URL.
function encodeKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

function blobUrl(config: AzureBlobConfig, key: string): string {
  const query = config.sasToken.replace(/^\?/, "");
  return `${config.accountUrl}/${config.container}/${encodeKey(key)}?${query}`;
}

/**
 * Azure Blob Storage implementation of {@link BlobStorage}, talking to the Blob
 * REST API directly with a SAS token. Using the REST surface keeps the
 * dependency footprint minimal; swapping in the official SDK later only touches
 * this file because callers depend solely on the interface.
 */
export function createAzureBlobStorage(config: AzureBlobConfig): BlobStorage {
  return {
    async put(key, data, contentType) {
      const headers: Record<string, string> = { "x-ms-blob-type": "BlockBlob" };
      if (contentType) {
        headers["Content-Type"] = contentType;
      }

      const response = await fetch(blobUrl(config, key), { method: "PUT", headers, body: data });
      if (!response.ok) {
        throw new Error(`Failed to put blob "${key}": ${response.status} ${response.statusText}`);
      }
    },

    async get(key) {
      const response = await fetch(blobUrl(config, key), { method: "GET" });
      if (!response.ok) {
        throw new Error(`Failed to get blob "${key}": ${response.status} ${response.statusText}`);
      }
      return new Uint8Array(await response.arrayBuffer());
    },

    async delete(key) {
      const response = await fetch(blobUrl(config, key), { method: "DELETE" });
      if (!response.ok && response.status !== HTTP_NOT_FOUND) {
        throw new Error(`Failed to delete blob "${key}": ${response.status} ${response.statusText}`);
      }
    },
  };
}

/**
 * Construct the Azure blob storage client from environment configuration.
 * Credentials are never hard-coded — they come from the deployment environment.
 */
export function azureBlobStorageFromEnv(): BlobStorage {
  const accountUrl = process.env.AZURE_STORAGE_ACCOUNT_URL;
  const container = process.env.AZURE_STORAGE_CONTAINER;
  const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;

  if (!accountUrl || !container || !sasToken) {
    throw new Error(
      "Azure blob storage is not configured: set AZURE_STORAGE_ACCOUNT_URL, AZURE_STORAGE_CONTAINER and AZURE_STORAGE_SAS_TOKEN",
    );
  }

  return createAzureBlobStorage({ accountUrl, container, sasToken });
}
