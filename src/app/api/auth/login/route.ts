import { NextResponse } from "next/server";
import { z } from "zod";
import { createOwnerToken, verifyOwnerCredentials } from "@/server/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
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
