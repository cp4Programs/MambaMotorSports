import { promises as fs } from "fs";
import path from "path";
import type { Booking, ContactMessage, Invoice } from "./types";

type StoreShape = {
  bookings: Booking[];
  contacts: ContactMessage[];
  invoices: Invoice[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

const SEED_INVOICES: Invoice[] = [
  {
    id: "inv-mms-1042",
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
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv-mms-1077",
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
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv-mms-0988",
    number: "MMS-0988",
    customer: "Priya S.",
    vehicle: "Mercedes C300",
    items: [{ desc: "Major service interval", amt: 1050 }],
    tax: 90,
    total: 1140,
    status: "Paid",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv-mms-0951",
    number: "MMS-0951",
    customer: "Alex M.",
    vehicle: "BMW 435i",
    items: [{ desc: "Oil & fluid service", amt: 200 }],
    tax: 20,
    total: 220,
    status: "Overdue",
    createdAt: new Date().toISOString(),
  },
];

async function ensureStore(): Promise<StoreShape> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoreShape;
  } catch {
    const initial: StoreShape = {
      bookings: [],
      contacts: [],
      invoices: SEED_INVOICES,
    };
    await fs.writeFile(STORE_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
}

async function writeStore(store: StoreShape) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function localCreateBooking(
  input: Omit<Booking, "id" | "createdAt" | "status"> & { status?: string },
): Promise<Booking> {
  const store = await ensureStore();
  const booking: Booking = {
    ...input,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: input.status ?? "Pending",
    createdAt: new Date().toISOString(),
  };
  store.bookings.unshift(booking);
  await writeStore(store);
  return booking;
}

export async function localListBookings(): Promise<Booking[]> {
  const store = await ensureStore();
  return store.bookings;
}

export async function localCreateContact(
  input: Omit<ContactMessage, "id" | "createdAt" | "status"> & { status?: string },
): Promise<ContactMessage> {
  const store = await ensureStore();
  const contact: ContactMessage = {
    ...input,
    id: `ct_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: input.status ?? "New",
    createdAt: new Date().toISOString(),
  };
  store.contacts.unshift(contact);
  await writeStore(store);
  return contact;
}

export async function localListContacts(): Promise<ContactMessage[]> {
  const store = await ensureStore();
  return store.contacts;
}

export async function localGetInvoiceByNumber(
  number: string,
): Promise<Invoice | null> {
  const store = await ensureStore();
  return (
    store.invoices.find((i) => i.number.toUpperCase() === number.toUpperCase()) ??
    null
  );
}

export async function localListInvoices(): Promise<Invoice[]> {
  const store = await ensureStore();
  return store.invoices;
}

export async function localMarkInvoicePaid(
  number: string,
  stripeSessionId?: string,
): Promise<Invoice | null> {
  const store = await ensureStore();
  const idx = store.invoices.findIndex(
    (i) => i.number.toUpperCase() === number.toUpperCase(),
  );
  if (idx < 0) return null;
  store.invoices[idx] = {
    ...store.invoices[idx],
    status: "Paid",
    stripeSessionId: stripeSessionId ?? store.invoices[idx].stripeSessionId,
  };
  await writeStore(store);
  return store.invoices[idx];
}

export async function localSetInvoiceSession(
  number: string,
  stripeSessionId: string,
): Promise<void> {
  const store = await ensureStore();
  const idx = store.invoices.findIndex(
    (i) => i.number.toUpperCase() === number.toUpperCase(),
  );
  if (idx < 0) return;
  store.invoices[idx].stripeSessionId = stripeSessionId;
  await writeStore(store);
}
