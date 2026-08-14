import { existsSync, readFileSync } from "fs";
import path from "path";

export type AmplifyOutputsFile = {
  data?: {
    url?: string;
    api_key?: string;
    default_authorization_type?: string;
  };
  storage?: {
    bucket_name?: string;
    aws_region?: string;
  };
  [key: string]: unknown;
};

export function loadAmplifyOutputs(): AmplifyOutputsFile | null {
  const filePath = path.join(process.cwd(), "amplify_outputs.json");
  if (!existsSync(filePath)) return null;
  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as AmplifyOutputsFile;
    if (!parsed?.data?.url) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasAmplifyData(): boolean {
  return loadAmplifyOutputs() !== null;
}
