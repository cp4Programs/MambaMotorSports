import { NextResponse } from "next/server";
import { IMAGE_SLOTS } from "@/lib/site";
import { getBearerToken, verifyOwnerToken } from "@/server/auth";
import { listSiteImageSlots } from "@/server/repo";

export async function GET(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const present = await listSiteImageSlots();
  return NextResponse.json({
    slots: IMAGE_SLOTS.map((slot) => ({
      ...slot,
      filled: present.includes(slot.id),
    })),
  });
}
