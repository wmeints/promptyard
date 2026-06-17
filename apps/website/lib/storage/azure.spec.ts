import { beforeEach, describe, expect, it, vi } from "vitest";

import { BlobServiceClient } from "@azure/storage-blob";
import { ClientSecretCredential } from "@azure/identity";

import { createAzureBlobStorage } from "./azure";

const mocks = vi.hoisted(() => {
  const uploadData = vi.fn<(...args: unknown[]) => Promise<void>>();
  const downloadToBuffer = vi.fn<() => Promise<Buffer>>();
  const deleteIfExists = vi.fn<() => Promise<unknown>>();
  const getBlockBlobClient = vi.fn<(key: string) => unknown>(() => ({
    uploadData,
    downloadToBuffer,
    deleteIfExists,
  }));
  const getContainerClient = vi.fn<(name: string) => unknown>(() => ({ getBlockBlobClient }));
  // BlobServiceClient and ClientSecretCredential are invoked with `new`, so
  // their mocks must be constructable — arrow functions are not.
  return {
    uploadData,
    downloadToBuffer,
    deleteIfExists,
    getBlockBlobClient,
    getContainerClient,
    BlobServiceClient: vi.fn<(...args: unknown[]) => unknown>(function () {
      return { getContainerClient };
    }),
    ClientSecretCredential: vi.fn<(...args: unknown[]) => unknown>(function () {
      return {};
    }),
  };
});

vi.mock("@azure/storage-blob", () => ({ BlobServiceClient: mocks.BlobServiceClient }));
vi.mock("@azure/identity", () => ({ ClientSecretCredential: mocks.ClientSecretCredential }));

const config = {
  accountUrl: "https://acct.blob.core.windows.net",
  container: "content",
  tenantId: "tenant-id",
  clientId: "client-id",
  clientSecret: "client-secret",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createAzureBlobStorage", () => {
  it("authenticates with a client-secret credential against the container", () => {
    createAzureBlobStorage(config);

    expect(ClientSecretCredential).toHaveBeenCalledWith("tenant-id", "client-id", "client-secret");
    expect(BlobServiceClient).toHaveBeenCalledWith(
      "https://acct.blob.core.windows.net",
      expect.anything(),
    );
    expect(mocks.getContainerClient).toHaveBeenCalledWith("content");
  });

  it("uploads block blob data as a forced-download attachment", async () => {
    const storage = createAzureBlobStorage(config);

    await storage.put("content/c1/v1/SKILL.md", new Uint8Array([1, 2, 3]), "text/markdown");

    expect(mocks.getBlockBlobClient).toHaveBeenCalledWith("content/c1/v1/SKILL.md");
    const [data, options] = mocks.uploadData.mock.calls[0];
    expect(Array.from(data)).toEqual([1, 2, 3]);
    expect(options.blobHTTPHeaders).toEqual({
      blobContentType: "text/markdown",
      blobContentDisposition: "attachment",
    });
  });

  it("defaults to an inert content type when none is given", async () => {
    const storage = createAzureBlobStorage(config);

    await storage.put("content/c1/v1/run.sh", new Uint8Array([1]));

    const [, options] = mocks.uploadData.mock.calls[0];
    expect(options.blobHTTPHeaders).toEqual({
      blobContentType: "application/octet-stream",
      blobContentDisposition: "attachment",
    });
  });

  it("returns blob bytes on get", async () => {
    mocks.downloadToBuffer.mockResolvedValue(Buffer.from([7, 8]));
    const storage = createAzureBlobStorage(config);

    const bytes = await storage.get("content/c1/v1/SKILL.md");

    expect(mocks.getBlockBlobClient).toHaveBeenCalledWith("content/c1/v1/SKILL.md");
    expect(Array.from(bytes)).toEqual([7, 8]);
  });

  it("deletes idempotently via deleteIfExists", async () => {
    const storage = createAzureBlobStorage(config);

    await storage.delete("content/c1/v1/gone.md");

    expect(mocks.getBlockBlobClient).toHaveBeenCalledWith("content/c1/v1/gone.md");
    expect(mocks.deleteIfExists).toHaveBeenCalledOnce();
  });
});
