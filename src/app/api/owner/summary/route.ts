import { NextResponse } from "next/server";
import { AuthError, requireOwner } from "@/server/auth";
import { listOwnerSummary } from "@/server/repository";

export async function GET(request: Request) {
  try {
    await requireOwner(request);
    const summary = await listOwnerSummary();
    return NextResponse.json(summary);
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unauthorized" },
      { status },
    );
  }
}
