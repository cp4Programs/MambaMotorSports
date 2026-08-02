import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Verifies a Cognito ID token from the Authorization Bearer header.
 * When Cognito env is unset (local demo), accepts OWNER_DEV_TOKEN as a bypass.
 */
export async function requireOwner(request: Request): Promise<{ sub: string }> {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    throw new AuthError("Missing authorization token");
  }

  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-west-2";
  const clientId = process.env.COGNITO_CLIENT_ID;

  if (!userPoolId || !clientId) {
    if (process.env.OWNER_DEV_TOKEN && token === process.env.OWNER_DEV_TOKEN) {
      return { sub: "dev-owner" };
    }
    // Local store mode: allow any non-empty token so dashboard wiring can be tested
    // after Amplify auth is configured in production.
    if (process.env.DATA_BACKEND !== "amplify" && process.env.NODE_ENV !== "production") {
      return { sub: "local-owner" };
    }
    throw new AuthError("Cognito is not configured");
  }

  const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
  const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
  const { payload } = await jwtVerify(token, jwks, {
    issuer,
    audience: clientId,
  });

  if (!payload.sub) throw new AuthError("Invalid token");
  return { sub: payload.sub };
}

export class AuthError extends Error {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
