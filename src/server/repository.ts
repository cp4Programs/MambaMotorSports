import {
  createBookingLocal,
  createContactLocal,
  getInvoiceByNumberLocal,
  listBookingsLocal,
  listContactsLocal,
  listInvoicesLocal,
  markInvoicePaidLocal,
  setInvoiceSessionLocal,
} from "@/server/local-store";
import type {
  BookingRecord,
  ContactRecord,
  InvoiceRecord,
  PublicInvoice,
} from "@/server/types";

/**
 * Data access layer. Uses local JSON store by default so `npm run dev` works
 * without Amplify sandbox. Set DATA_BACKEND=amplify once amplify_outputs.json
 * is present to use AppSync/DynamoDB.
 */
function isAmplifyBackend() {
  return process.env.DATA_BACKEND === "amplify";
}

export async function createBooking(
  input: Omit<BookingRecord, "id" | "status" | "createdAt">,
): Promise<BookingRecord> {
  if (isAmplifyBackend()) {
    const { createBookingAmplify } = await import("@/server/amplify-data");
    return createBookingAmplify(input);
  }
  return createBookingLocal(input);
}

export async function createContact(
  input: Omit<ContactRecord, "id" | "status" | "createdAt">,
): Promise<ContactRecord> {
  if (isAmplifyBackend()) {
    const { createContactAmplify } = await import("@/server/amplify-data");
    return createContactAmplify(input);
  }
  return createContactLocal(input);
}

export async function getInvoiceByNumber(
  number: string,
): Promise<InvoiceRecord | null> {
  if (isAmplifyBackend()) {
    const { getInvoiceByNumberAmplify } = await import("@/server/amplify-data");
    return getInvoiceByNumberAmplify(number);
  }
  return getInvoiceByNumberLocal(number);
}

export async function getPublicInvoice(
  number: string,
): Promise<PublicInvoice | null> {
  const inv = await getInvoiceByNumber(number);
  if (!inv) return null;
  return {
    number: inv.number,
    customer: inv.customer,
    vehicle: inv.vehicle,
    items: inv.items,
    tax: inv.tax,
    total: inv.total,
    status: inv.status,
  };
}

export async function markInvoicePaid(
  number: string,
  stripeSessionId?: string,
): Promise<InvoiceRecord | null> {
  if (isAmplifyBackend()) {
    const { markInvoicePaidAmplify } = await import("@/server/amplify-data");
    return markInvoicePaidAmplify(number, stripeSessionId);
  }
  return markInvoicePaidLocal(number, stripeSessionId);
}

export async function setInvoiceSession(
  number: string,
  stripeSessionId: string,
): Promise<void> {
  if (isAmplifyBackend()) {
    const { setInvoiceSessionAmplify } = await import("@/server/amplify-data");
    return setInvoiceSessionAmplify(number, stripeSessionId);
  }
  return setInvoiceSessionLocal(number, stripeSessionId);
}

export async function listOwnerSummary() {
  if (isAmplifyBackend()) {
    const { listOwnerSummaryAmplify } = await import("@/server/amplify-data");
    return listOwnerSummaryAmplify();
  }
  const [bookings, messages, invoices] = await Promise.all([
    listBookingsLocal(),
    listContactsLocal(),
    listInvoicesLocal(),
  ]);
  return {
    bookings: bookings.map((b) => ({
      id: b.id,
      name: b.name,
      vehicle: `${b.year} ${b.make} ${b.model}`,
      serviceType: b.serviceType,
      date: b.date,
      status: b.status,
    })),
    messages: messages.map((m) => ({
      id: m.id,
      name: m.name,
      vehicle: m.vehicle,
      message: m.message,
      status: m.status,
    })),
    invoices: invoices.map((i) => ({
      id: i.id,
      number: i.number,
      customer: i.customer,
      total: i.total,
      status: i.status,
    })),
  };
}
