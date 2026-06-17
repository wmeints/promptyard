import { afterEach, describe, expect, it, vi } from "vitest";

import { createAzureBlobStorage } from "./azure";

const config = {
  accountUrl: "https://acct.blob.core.windows.net",
  container: "content",
  sasToken: "?sv=2024&sig=abc",
};

function mockFetch(response: Partial<Response> & { ok: boolean; status: number }) {
  const fetchMock = vi
    .fn<(...args: unknown[]) => Promise<unknown>>()
    .mockResolvedValue({ statusText: "", ...response });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createAzureBlobStorage", () => {
  it("PUTs a block blob to the SAS-signed URL with the right headers", async () => {
    const fetchMock = mockFetch({ ok: true, status: 201 });
    const storage = createAzureBlobStorage(config);

    await storage.put("content/c1/v1/SKILL.md", new Uint8Array([1, 2, 3]), "text/markdown");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://acct.blob.core.windows.net/content/content/c1/v1/SKILL.md?sv=2024&sig=abc",
    );
    expect(init.method).toBe("PUT");
    expect(init.headers["x-ms-blob-type"]).toBe("BlockBlob");
    expect(init.headers["Content-Type"]).toBe("text/markdown");
  });

  it("returns blob bytes on get", async () => {
    mockFetch({ ok: true, status: 200, arrayBuffer: async () => new Uint8Array([7, 8]).buffer });
    const storage = createAzureBlobStorage(config);

    const bytes = await storage.get("content/c1/v1/SKILL.md");

    expect(Array.from(bytes)).toEqual([7, 8]);
  });

  it("throws when get fails", async () => {
    mockFetch({ ok: false, status: 403, statusText: "Forbidden" });
    const storage = createAzureBlobStorage(config);

    await expect(storage.get("content/c1/v1/SKILL.md")).rejects.toThrow("403");
  });

  it("treats a 404 on delete as success", async () => {
    mockFetch({ ok: false, status: 404, statusText: "Not Found" });
    const storage = createAzureBlobStorage(config);

    await expect(storage.delete("content/c1/v1/gone.md")).resolves.toBeUndefined();
  });

  it("throws on a non-404 delete failure", async () => {
    mockFetch({ ok: false, status: 500, statusText: "Server Error" });
    const storage = createAzureBlobStorage(config);

    await expect(storage.delete("content/c1/v1/SKILL.md")).rejects.toThrow("500");
  });
});
