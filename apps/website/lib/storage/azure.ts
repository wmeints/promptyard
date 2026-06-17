import { ClientSecretCredential } from "@azure/identity";
import { BlobServiceClient, type ContainerClient } from "@azure/storage-blob";

import type { BlobStorage } from "./blob";

export interface AzureBlobConfig {
  /** Blob endpoint, e.g. `https://myaccount.blob.core.windows.net`. */
  accountUrl: string;
  /** Container that holds all content blobs. */
  container: string;
  /** Entra (Azure AD) directory the app registration lives in. */
  tenantId: string;
  /** App registration (client) ID. */
  clientId: string;
  /** App registration client secret. */
  clientSecret: string;
}

function containerClient(config: AzureBlobConfig): ContainerClient {
  const credential = new ClientSecretCredential(
    config.tenantId,
    config.clientId,
    config.clientSecret,
  );
  return new BlobServiceClient(config.accountUrl, credential).getContainerClient(config.container);
}

/**
 * Azure Blob Storage implementation of {@link BlobStorage}, built on the official
 * `@azure/storage-blob` SDK and authenticated with an Entra app registration
 * (client + client secret) via `@azure/identity`. Swapping providers later only
 * touches this file because callers depend solely on the interface.
 */
export function createAzureBlobStorage(config: AzureBlobConfig): BlobStorage {
  const container = containerClient(config);

  return {
    async put(key, data, contentType) {
      const blob = container.getBlockBlobClient(key);
      await blob.uploadData(data, {
        blobHTTPHeaders: contentType ? { blobContentType: contentType } : undefined,
      });
    },

    async get(key) {
      const buffer = await container.getBlockBlobClient(key).downloadToBuffer();
      return new Uint8Array(buffer);
    },

    async delete(key) {
      await container.getBlockBlobClient(key).deleteIfExists();
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
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!accountUrl || !container || !tenantId || !clientId || !clientSecret) {
    throw new Error(
      "Azure blob storage is not configured: set AZURE_STORAGE_ACCOUNT_URL, AZURE_STORAGE_CONTAINER, AZURE_TENANT_ID, AZURE_CLIENT_ID and AZURE_CLIENT_SECRET",
    );
  }

  return createAzureBlobStorage({ accountUrl, container, tenantId, clientId, clientSecret });
}
