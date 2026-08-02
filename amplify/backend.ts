import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

/**
 * Amplify Gen 2 backend — Cognito (owner) + AppSync/DynamoDB data.
 * Deployed automatically with Amplify Hosting when amplify/ is in the repo,
 * or locally via: npm run sandbox
 */
defineBackend({
  auth,
  data,
});
