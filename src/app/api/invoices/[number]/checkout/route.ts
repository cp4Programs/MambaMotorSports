import { NextResponse } from "next/server";
import {
  getInvoiceByNumber,
  markInvoicePaid,
  setInvoiceSession,
} from "@/server/repository";
import { createInvoiceCheckoutSession } from "@/server/stripe";

export async function POST(
  _request: Request,
  context: { params: Promise<{ number: string }> },
) {
  try {
    const { number } = await context.params;
    const invoice = await getInvoiceByNumber(number.trim().toUpperCase());
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    if (invoice.status === "Paid") {
      return NextResponse.json(
        { error: "Invoice is already paid" },
        { status: 400 },
      );
    }

    const session = await createInvoiceCheckoutSession(invoice);
    await setInvoiceSession(invoice.number, session.id);

    if (session.demo) {
      await markInvoicePaid(invoice.number, session.id);
    }

    return NextResponse.json({ url: session.url, demo: session.demo });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
