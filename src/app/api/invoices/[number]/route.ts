import { NextResponse } from "next/server";
import { getInvoiceByNumber } from "@/server/repo";

export async function GET(
  _req: Request,
  context: { params: Promise<{ number: string }> },
) {
  const { number } = await context.params;
  const invoice = await getInvoiceByNumber(decodeURIComponent(number));
  if (!invoice) {
    return NextResponse.json(
      {
        error: `No invoice found for "${number}". Try MMS-1042 or MMS-1077.`,
      },
      { status: 404 },
    );
  }
  return NextResponse.json({
    number: invoice.number,
    customer: invoice.customer,
    vehicle: invoice.vehicle,
    items: invoice.items,
    tax: invoice.tax,
    total: invoice.total,
    status: invoice.status,
  });
}
