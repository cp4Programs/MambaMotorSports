import { NextResponse } from "next/server";
import { getPublicInvoice } from "@/server/repository";

export async function GET(
  _request: Request,
  context: { params: Promise<{ number: string }> },
) {
  const { number } = await context.params;
  const invoice = await getPublicInvoice(number.trim().toUpperCase());
  if (!invoice) {
    return NextResponse.json(
      {
        error: `No invoice found for "${number}". Try MMS-1042 or MMS-1077.`,
      },
      { status: 404 },
    );
  }
  return NextResponse.json({ invoice });
}
