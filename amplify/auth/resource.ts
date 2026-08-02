import { defineAuth } from "@aws-amplify/backend";

/**
 * Owner-only Cognito user pool for the dashboard.
 * Create the shop owner user after first deploy / sandbox:
 *   aws cognito-idp admin-create-user --user-pool-id ... --username owner@...
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
