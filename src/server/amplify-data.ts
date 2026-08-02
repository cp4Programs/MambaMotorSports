import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import path from "path";
import type { Schema } from "../../amplify/data/resource";
import type {
  BookingRecord,
  ContactRecord,
  InvoiceItem,
  InvoiceRecord,
} from "@/server/types";

let configured = false;

function configure() {
  if (configured) return;
  const outputsPath = path.join(process.cwd(), "amplify_outputs.json");
  const outputs = JSON.parse(readFileSync(outputsPath, "utf8"));
  Amplify.configure(outputs, { ssr: true });
  configured = true;
}

function client() {
  configure();
  return generateClient<Schema>({ authMode: "apiKey" });
}

function parseItems(itemsJson: string): InvoiceItem[] {
  try {
    return JSON.parse(itemsJson) as InvoiceItem[];
  } catch {
    return [];
  }
}

export async function createBookingAmplify(
  input: Omit<BookingRecord, "id" | "status" | "createdAt">,
): Promise<BookingRecord> {
  const { data, errors } = await client().models.Booking.create({
    ...input,
    status: "Pending",
  });
  if (errors?.length || !data) {
    throw new Error(errors?.[0]?.message || "Failed to create booking");
  }
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    make: data.make,
    model: data.model,
    year: data.year,
    serviceType: data.serviceType,
    date: data.date,
    time: data.time,
    issue: data.issue,
    status: data.status,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export async function createContactAmplify(
  input: Omit<ContactRecord, "id" | "status" | "createdAt">,
): Promise<ContactRecord> {
  const { data, errors } = await client().models.ContactMessage.create({
    name: input.name,
    phone: input.phone,
    email: input.email,
    vehicle: input.vehicle,
    message: input.message,
    status: "New",
  });
  if (errors?.length || !data) {
    throw new Error(errors?.[0]?.message || "Failed to create contact");
  }
  return {
    id: data.id,
    name: data.name,
    phone: data.phone || undefined,
    email: data.email,
    vehicle: data.vehicle || undefined,
    message: data.message,
    status: data.status,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export async function getInvoiceByNumberAmplify(
  number: string,
): Promise<InvoiceRecord | null> {
  const { data } = await client().models.Invoice.list({
    filter: { number: { eq: number.toUpperCase() } },
  });
  const row = data?.[0];
  if (!row) return null;
  return {
    id: row.id,
    number: row.number,
    customer: row.customer,
    vehicle: row.vehicle,
    items: parseItems(row.itemsJson),
    tax: row.tax,
    total: row.total,
    status: row.status as InvoiceRecord["status"],
    stripeSessionId: row.stripeSessionId || undefined,
    createdAt: row.createdAt || new Date().toISOString(),
  };
}

export async function markInvoicePaidAmplify(
  number: string,
  stripeSessionId?: string,
): Promise<InvoiceRecord | null> {
  const existing = await getInvoiceByNumberAmplify(number);
  if (!existing) return null;
  const { data, errors } = await client().models.Invoice.update({
    id: existing.id,
    status: "Paid",
    stripeSessionId: stripeSessionId || existing.stripeSessionId,
  });
  if (errors?.length || !data) {
    throw new Error(errors?.[0]?.message || "Failed to update invoice");
  }
  return {
    ...existing,
    status: "Paid",
    stripeSessionId: data.stripeSessionId || undefined,
  };
}

export async function setInvoiceSessionAmplify(
  number: string,
  stripeSessionId: string,
): Promise<void> {
  const existing = await getInvoiceByNumberAmplify(number);
  if (!existing) return;
  await client().models.Invoice.update({
    id: existing.id,
    stripeSessionId,
  });
}

export async function listOwnerSummaryAmplify() {
  const c = client();
  const [bookingsRes, messagesRes, invoicesRes] = await Promise.all([
    c.models.Booking.list(),
    c.models.ContactMessage.list(),
    c.models.Invoice.list(),
  ]);

  return {
    bookings: (bookingsRes.data || []).map((b) => ({
      id: b.id,
      name: b.name,
      vehicle: `${b.year} ${b.make} ${b.model}`,
      serviceType: b.serviceType,
      date: b.date,
      status: b.status,
    })),
    messages: (messagesRes.data || []).map((m) => ({
      id: m.id,
      name: m.name,
      vehicle: m.vehicle,
      message: m.message,
      status: m.status,
    })),
    invoices: (invoicesRes.data || []).map((i) => ({
      id: i.id,
      number: i.number,
      customer: i.customer,
      total: i.total,
      status: i.status,
    })),
  };
}

export async function seedInvoicesAmplify() {
  const seeds = [
    {
      number: "MMS-1042",
      customer: "Dana R.",
      vehicle: "BMW X5",
      items: [
        { desc: "Brake pads & rotors (front)", amt: 520 },
        { desc: "Brake fluid flush", amt: 95 },
      ],
      tax: 54,
      total: 669,
      status: "Pending",
    },
    {
      number: "MMS-1077",
      customer: "Marcus T.",
      vehicle: "Audi Q7",
      items: [
        { desc: "Diagnostic scan", amt: 210 },
        { desc: "Software update", amt: 80 },
      ],
      tax: 24,
      total: 314,
      status: "Pending",
    },
  ] as const;

  for (const seed of seeds) {
    const existing = await getInvoiceByNumberAmplify(seed.number);
    if (existing) continue;
    await client().models.Invoice.create({
      number: seed.number,
      customer: seed.customer,
      vehicle: seed.vehicle,
      itemsJson: JSON.stringify(seed.items),
      tax: seed.tax,
      total: seed.total,
      status: seed.status,
    });
  }
  return { seeded: true, id: randomUUID() };
}
