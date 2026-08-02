import {
  localCreateBooking,
  localCreateContact,
  localGetInvoiceByNumber,
  localListBookings,
  localListContacts,
  localListInvoices,
  localMarkInvoicePaid,
  localSetInvoiceSession,
} from "./local-store";
import type { Booking, ContactMessage, Invoice } from "./types";

/**
 * Persistence facade.
 * Uses the local JSON store by default (works offline / pre-Amplify).
 * When Amplify Data is wired (amplify_outputs.json + client), swap implementations here.
 */
export async function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status">,
): Promise<Booking> {
  return localCreateBooking(input);
}

export async function listBookings(): Promise<Booking[]> {
  return localListBookings();
}

export async function createContact(
  input: Omit<ContactMessage, "id" | "createdAt" | "status">,
): Promise<ContactMessage> {
  return localCreateContact(input);
}

export async function listContacts(): Promise<ContactMessage[]> {
  return localListContacts();
}

export async function getInvoiceByNumber(number: string): Promise<Invoice | null> {
  return localGetInvoiceByNumber(number);
}

export async function listInvoices(): Promise<Invoice[]> {
  return localListInvoices();
}

export async function markInvoicePaid(
  number: string,
  stripeSessionId?: string,
): Promise<Invoice | null> {
  return localMarkInvoicePaid(number, stripeSessionId);
}

export async function setInvoiceSession(
  number: string,
  stripeSessionId: string,
): Promise<void> {
  return localSetInvoiceSession(number, stripeSessionId);
}
