import { NextResponse } from "next/server";
import { z } from "zod";
import { getBearerToken, verifyOwnerToken } from "@/server/auth";
import { getSiteCopy, saveSiteCopy } from "@/server/repo";

const copySchema = z.object({
  heroEyebrow: z.string(),
  heroTitleAccent: z.string(),
  heroTitleRest: z.string(),
  heroBody: z.string(),
  aboutHeadline: z.string(),
  aboutBody: z.string(),
  founderName: z.string(),
  founderBio1: z.string(),
  founderBio2: z.string(),
  badges: z.array(z.string()),
  hoursWeekdays: z.string(),
  hoursSaturday: z.string(),
  hoursSunday: z.string(),
  contactIntro: z.string(),
  contactResponseNote: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  servicePageIntro: z.string(),
});

export async function GET(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const copy = await getSiteCopy();
  return NextResponse.json({ copy });
}

export async function PUT(req: Request) {
  if (!verifyOwnerToken(getBearerToken(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = copySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid site copy" }, { status: 400 });
  }
  const copy = await saveSiteCopy(parsed.data);
  return NextResponse.json({ copy });
}
