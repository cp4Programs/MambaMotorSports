/**
 * Seeds demo invoices into Amplify Data when DATA_BACKEND=amplify.
 * Local store already seeds on first write.
 */
import { seedInvoicesAmplify } from "../src/server/amplify-data";

async function main() {
  if (process.env.DATA_BACKEND !== "amplify") {
    console.log("Local store seeds automatically on first API use. Nothing to do.");
    return;
  }
  await seedInvoicesAmplify();
  console.log("Seeded Amplify invoices MMS-1042 and MMS-1077 (if missing).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
