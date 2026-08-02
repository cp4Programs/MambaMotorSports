import { NextResponse } from "next/server";
import { getBearerToken, verifyOwnerToken } from "@/server/auth";
import { listBookings } from "@/server/repo";

export async function GET(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await listBookings();
  return NextResponse.json({
    items: items.map((b) => ({
      id: b.id,
      name: b.name,
      make: b.make,
      model: b.model,
      serviceType: b.serviceType,
      date: b.date,
      status: b.status,
    })),
  });
}
