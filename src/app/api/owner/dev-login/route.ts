import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Local/demo owner login used when Cognito amplify_outputs is not present.
 * Set OWNER_DEMO_PASSWORD in .env.local (default: mamba-owner).
 */
export async function POST(request: Request) {
  if (process.env.DATA_BACKEND === "amplify" && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Use Cognito sign-in in production" },
      { status: 403 },
    );
  }

  try {
    const body = schema.parse(await request.json());
    const expected = process.env.OWNER_DEMO_PASSWORD || "mamba-owner";
    if (body.password !== expected) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = process.env.OWNER_DEV_TOKEN || "local-owner-token";
    return NextResponse.json({ token, email: body.email });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof z.ZodError
            ? "Invalid login payload"
            : err instanceof Error
              ? err.message
              : "Login failed",
      },
      { status: 400 },
    );
  }
}
