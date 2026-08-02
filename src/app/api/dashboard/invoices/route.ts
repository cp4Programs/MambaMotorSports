import { NextResponse } from "next/server";
import { getBearerToken, verifyOwnerToken } from "@/server/auth";
import { listInvoices } from "@/server/repo";

export async function GET(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await listInvoices();
  return NextResponse.json({
    items: items.map((i) => ({
      id: i.id,
      number: i.number,
      customer: i.customer,
      total: i.total,
      status: i.status,
    })),
  });
}
