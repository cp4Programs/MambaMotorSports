/**
 * Amplify client bootstrap.
 * After `npx ampx sandbox` or Amplify Hosting deploy, copy/generate amplify_outputs.json
 * at the project root and configure the client (Auth + Data) from that file.
 */
export function isAmplifyConfigured(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../amplify_outputs.json");
    return true;
  } catch {
    return false;
  }
}
