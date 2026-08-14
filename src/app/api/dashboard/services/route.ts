import { NextResponse } from "next/server";
import { z } from "zod";
import { getBearerToken, verifyOwnerToken } from "@/server/auth";
import { listSiteServices, saveSiteServices } from "@/server/repo";

const servicesSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().min(1),
    blurb: z.string().min(1),
    price: z.string().min(1),
    sortOrder: z.number(),
  }),
);

export async function GET(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await listSiteServices();
  return NextResponse.json({ items });
}

export async function PUT(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = servicesSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid services" }, { status: 400 });
  }
  const items = await saveSiteServices(parsed.data);
  return NextResponse.json({ items });
}
