"use client";

import { Amplify } from "aws-amplify";

let configured = false;

export async function configureAmplify() {
  if (configured || typeof window === "undefined") return;
  configured = true;

  try {
    const res = await fetch("/amplify_outputs.json", { cache: "no-store" });
    if (!res.ok) return;
    const outputs = await res.json();
    Amplify.configure(outputs, { ssr: true });
  } catch {
    // Cognito UI will stay unavailable until amplify_outputs.json is published.
  }
}

export function hasAmplifyOutputsSync() {
  return false;
}
