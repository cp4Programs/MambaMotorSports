import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createOwnerToken,
  isOwnerAuthConfigured,
  verifyOwnerCredentials,
} from "@/server/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    if (!isOwnerAuthConfigured()) {
      return NextResponse.json(
        {
          error:
            "Owner login is not configured. Set OWNER_EMAIL, OWNER_PASSWORD, and OWNER_SESSION_SECRET in Amplify, then redeploy.",
        },
        { status: 503 },
      );
    }
    const body = schema.parse(await req.json());
    if (!verifyOwnerCredentials(body.email, body.password)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }
    const token = createOwnerToken(body.email);
    return NextResponse.json({ token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
