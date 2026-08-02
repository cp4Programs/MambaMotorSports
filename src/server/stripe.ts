import Stripe from "stripe";
import type { InvoiceRecord } from "@/server/types";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function createInvoiceCheckoutSession(invoice: InvoiceRecord) {
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!stripe) {
    // Dev fallback when Stripe keys are not configured yet.
    return {
      id: `dev_session_${invoice.number}`,
      url: `${appUrl}/pay?success=1&invoice=${encodeURIComponent(invoice.number)}&dev=1`,
      demo: true as const,
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${appUrl}/pay?success=1&invoice=${encodeURIComponent(invoice.number)}`,
    cancel_url: `${appUrl}/pay?canceled=1&invoice=${encodeURIComponent(invoice.number)}`,
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

  return { id: session.id, url: session.url!, demo: false as const };
}

export function constructStripeEvent(
  payload: string | Buffer,
  signature: string,
) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    throw new Error("Stripe webhook is not configured");
  }
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
