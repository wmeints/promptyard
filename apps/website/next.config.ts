import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // The upload server action receives a zip body; raise the default 1 MB
      // parser cap to the upload ceiling enforced in lib/content/limits.ts.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
