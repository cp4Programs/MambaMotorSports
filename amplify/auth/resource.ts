import { defineAuth } from "@aws-amplify/backend";

/**
 * Owner-only Cognito user pool.
 * Create the shop owner in Amplify Console or via `ampx sandbox` + Cognito UI.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
