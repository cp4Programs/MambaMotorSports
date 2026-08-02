import { NextResponse } from "next/server";
import {
  getInvoiceByNumber,
  markInvoicePaid,
  setInvoiceSession,
} from "@/server/repo";
import { appBaseUrl, getStripe } from "@/server/stripe";

export async function POST(
  req: Request,
  context: { params: Promise<{ number: string }> },
) {
  const { number: raw } = await context.params;
  const number = decodeURIComponent(raw).toUpperCase();
  const invoice = await getInvoiceByNumber(number);

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  if (invoice.status === "Paid") {
    return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
  }

  const stripe = getStripe();
  const base = appBaseUrl(req);

  // Dev / pre-Stripe mode: mark paid and return success URL so the flow is testable.
  // This settles invoices WITHOUT payment, so it requires an explicit opt-in
  // (ALLOW_DEV_PAYMENTS=true) and is force-disabled in production. A missing
  // Stripe key must never let invoices be settled for free — fail closed.
  if (!stripe) {
    const devPaymentsAllowed =
      process.env.NODE_ENV !== "production" &&
      process.env.ALLOW_DEV_PAYMENTS === "true";
    if (!devPaymentsAllowed) {
      return NextResponse.json(
        { error: "Payments are not configured." },
        { status: 503 },
      );
    }
    await markInvoicePaid(number, `dev_${Date.now()}`);
    return NextResponse.json({
      url: `${base}/pay/success?invoice=${encodeURIComponent(number)}`,
      mode: "dev",
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${base}/pay/success?invoice=${encodeURIComponent(number)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/pay?canceled=1&invoice=${encodeURIComponent(number)}`,
      customer_email: undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(invoice.total * 100),
            product_data: {
              name: `Mamba Motor Sports Invoice ${invoice.number}`,
              description: `${invoice.customer} · ${invoice.vehicle}`,
            },
          },
        },
      ],
      metadata: {
        invoiceNumber: invoice.number,
      },
    });

    if (session.id) await setInvoiceSession(number, session.id);
    return NextResponse.json({ url: session.url, mode: "stripe" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
