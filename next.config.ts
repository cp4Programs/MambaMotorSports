import { existsSync } from "fs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  serverExternalPackages: ["aws-amplify", "@aws-amplify/adapter-nextjs"],
  ...(existsSync("./amplify_outputs.json")
    ? {
        outputFileTracingIncludes: {
          "/api/**/*": ["./amplify_outputs.json"],
        },
      }
    : {}),
};

export default nextConfig;
