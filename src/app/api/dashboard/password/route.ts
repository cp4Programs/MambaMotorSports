import { NextResponse } from "next/server";
import { z } from "zod";
import {
  changeOwnerPassword,
  getBearerToken,
  verifyOwnerToken,
} from "@/server/auth";
import { MIN_PASSWORD_LENGTH } from "@/server/password";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(MIN_PASSWORD_LENGTH),
});

export async function POST(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }
  const result = await changeOwnerPassword(
    parsed.data.currentPassword,
    parsed.data.newPassword,
  );
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true });
}
