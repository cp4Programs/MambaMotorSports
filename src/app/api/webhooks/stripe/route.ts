import { NextResponse } from "next/server";
import { markInvoicePaid } from "@/server/repository";
import { constructStripeEvent } from "@/server/stripe";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const payload = await request.text();
    const event = constructStripeEvent(payload, signature);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const invoiceNumber = session.metadata?.invoiceNumber;
      if (invoiceNumber) {
        await markInvoicePaid(invoiceNumber, session.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook error" },
      { status: 400 },
    );
  }
}
