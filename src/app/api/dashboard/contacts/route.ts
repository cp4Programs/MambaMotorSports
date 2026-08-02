import { NextResponse } from "next/server";
import { getBearerToken, verifyOwnerToken } from "@/server/auth";
import { listContacts } from "@/server/repo";

export async function GET(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await listContacts();
  return NextResponse.json({
    items: items.map((c) => ({
      id: c.id,
      name: c.name,
      vehicle: c.vehicle,
      message: c.message,
      status: c.status,
    })),
  });
}
