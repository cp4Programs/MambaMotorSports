import { NextResponse } from "next/server";
import { z } from "zod";
import { IMAGE_SLOTS } from "@/lib/site";
import { getBearerToken, verifyOwnerToken } from "@/server/auth";
import { deleteSiteImage, saveSiteImage } from "@/server/repo";

const slotIds = IMAGE_SLOTS.map((s) => s.id);

const bodySchema = z.object({
  contentType: z.string().regex(/^image\/(jpeg|png|webp|gif)$/),
  dataBase64: z.string().min(32).max(400_000),
});

export async function PUT(
  req: Request,
  context: { params: Promise<{ slot: string }> },
) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slot } = await context.params;
  if (!slotIds.includes(slot as (typeof slotIds)[number])) {
    return NextResponse.json({ error: "Unknown photo slot" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Use a JPG/PNG/WebP under ~250KB" },
      { status: 400 },
    );
  }
  await saveSiteImage(slot, parsed.data.contentType, parsed.data.dataBase64);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ slot: string }> },
) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slot } = await context.params;
  await deleteSiteImage(slot);
  return NextResponse.json({ ok: true });
}
