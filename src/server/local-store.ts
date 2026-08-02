import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type {
  BookingRecord,
  ContactRecord,
  InvoiceItem,
  InvoiceRecord,
} from "@/server/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

type Store = {
  bookings: BookingRecord[];
  messages: ContactRecord[];
  invoices: InvoiceRecord[];
};

const SEED_INVOICES: InvoiceRecord[] = [
  {
    id: "seed-mms-1042",
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
    id: "seed-mms-1077",
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
    id: "seed-mms-0988",
    number: "MMS-0988",
    customer: "Priya S.",
    vehicle: "Mercedes C300",
    items: [{ desc: "Major service interval", amt: 1080 }],
    tax: 60,
    total: 1140,
    status: "Paid",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-mms-0951",
    number: "MMS-0951",
    customer: "Alex M.",
    vehicle: "BMW 435i",
    items: [{ desc: "Oil & fluid service", amt: 205 }],
    tax: 15,
    total: 220,
    status: "Overdue",
    createdAt: new Date().toISOString(),
  },
];

async function ensureStore(): Promise<Store> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    const initial: Store = {
      bookings: [],
      messages: [],
      invoices: SEED_INVOICES,
    };
    await fs.writeFile(STORE_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
}

async function save(store: Store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function createBookingLocal(
  input: Omit<BookingRecord, "id" | "status" | "createdAt">,
): Promise<BookingRecord> {
  const store = await ensureStore();
  const record: BookingRecord = {
    ...input,
    id: randomUUID(),
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  store.bookings.unshift(record);
  await save(store);
  return record;
}

export async function createContactLocal(
  input: Omit<ContactRecord, "id" | "status" | "createdAt">,
): Promise<ContactRecord> {
  const store = await ensureStore();
  const record: ContactRecord = {
    ...input,
    id: randomUUID(),
    status: "New",
    createdAt: new Date().toISOString(),
  };
  store.messages.unshift(record);
  await save(store);
  return record;
}

export async function getInvoiceByNumberLocal(
  number: string,
): Promise<InvoiceRecord | null> {
  const store = await ensureStore();
  return (
    store.invoices.find((i) => i.number.toUpperCase() === number.toUpperCase()) ||
    null
  );
}

export async function markInvoicePaidLocal(
  number: string,
  stripeSessionId?: string,
): Promise<InvoiceRecord | null> {
  const store = await ensureStore();
  const inv = store.invoices.find(
    (i) => i.number.toUpperCase() === number.toUpperCase(),
  );
  if (!inv) return null;
  inv.status = "Paid";
  if (stripeSessionId) inv.stripeSessionId = stripeSessionId;
  await save(store);
  return inv;
}

export async function setInvoiceSessionLocal(
  number: string,
  stripeSessionId: string,
): Promise<void> {
  const store = await ensureStore();
  const inv = store.invoices.find(
    (i) => i.number.toUpperCase() === number.toUpperCase(),
  );
  if (!inv) return;
  inv.stripeSessionId = stripeSessionId;
  await save(store);
}

export async function listBookingsLocal(): Promise<BookingRecord[]> {
  return (await ensureStore()).bookings;
}

export async function listContactsLocal(): Promise<ContactRecord[]> {
  return (await ensureStore()).messages;
}

export async function listInvoicesLocal(): Promise<InvoiceRecord[]> {
  return (await ensureStore()).invoices;
}

export async function upsertInvoiceLocal(input: {
  number: string;
  customer: string;
  vehicle: string;
  items: InvoiceItem[];
  tax: number;
  total: number;
  status: InvoiceRecord["status"];
}): Promise<InvoiceRecord> {
  const store = await ensureStore();
  const existing = store.invoices.find(
    (i) => i.number.toUpperCase() === input.number.toUpperCase(),
  );
  if (existing) {
    Object.assign(existing, input);
    await save(store);
    return existing;
  }
  const record: InvoiceRecord = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  store.invoices.unshift(record);
  await save(store);
  return record;
}
