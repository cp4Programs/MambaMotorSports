import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { loadAmplifyOutputs } from "./amplify-outputs";

type DataClient = ReturnType<typeof generateClient<Schema>>;

let cached: DataClient | undefined;

export function getAmplifyDataClient(): DataClient | null {
  if (cached) return cached;

  const outputs = loadAmplifyOutputs();
  if (!outputs) return null;

  Amplify.configure(outputs as Parameters<typeof Amplify.configure>[0], {
    ssr: true,
  });
  cached = generateClient<Schema>({ authMode: "apiKey" });
  return cached;
}

export function throwIfErrors(
  errors: { message: string }[] | null | undefined,
  action: string,
): void {
  if (!errors?.length) return;
  throw new Error(`${action}: ${errors.map((e) => e.message).join("; ")}`);
}
