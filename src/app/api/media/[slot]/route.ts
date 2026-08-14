import { NextResponse } from "next/server";
import { getSiteImage } from "@/server/repo";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slot: string }> },
) {
  const { slot } = await context.params;
  const image = await getSiteImage(slot);
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const bytes = Buffer.from(image.dataBase64, "base64");
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=60",
    },
  });
}
