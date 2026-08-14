import {
  amplifyDeleteSiteImage,
  amplifyGetSiteCopy,
  amplifyGetSiteImage,
  amplifyListSiteImageSlots,
  amplifyListSiteServices,
  amplifySaveSiteCopy,
  amplifySaveSiteImage,
  amplifySaveSiteServices,
} from "./cms-amplify";
import { hasAmplifyData } from "./amplify-outputs";
import {
  localCreateBooking,
  localCreateContact,
  localDeleteSiteImage,
  localGetInvoiceByNumber,
  localGetSiteCopy,
  localGetSiteImage,
  localListBookings,
  localListContacts,
  localListInvoices,
  localListSiteImageSlots,
  localListSiteServices,
  localMarkInvoicePaid,
  localSaveSiteCopy,
  localSaveSiteImage,
  localSaveSiteServices,
  localSetInvoiceSession,
} from "./local-store";
import type { SiteCopy, SiteService } from "@/lib/site";
import type { SiteImageRecord } from "./site-utils";
import type { Booking, ContactMessage, Invoice } from "./types";

function useAmplify(): boolean {
  return hasAmplifyData();
}

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

export async function getSiteCopy(): Promise<SiteCopy> {
  return useAmplify() ? amplifyGetSiteCopy() : localGetSiteCopy();
}

export async function saveSiteCopy(copy: SiteCopy): Promise<SiteCopy> {
  return useAmplify() ? amplifySaveSiteCopy(copy) : localSaveSiteCopy(copy);
}

export async function listSiteServices(): Promise<SiteService[]> {
  return useAmplify() ? amplifyListSiteServices() : localListSiteServices();
}

export async function saveSiteServices(
  services: SiteService[],
): Promise<SiteService[]> {
  return useAmplify()
    ? amplifySaveSiteServices(services)
    : localSaveSiteServices(services);
}

export async function getSiteImage(
  slot: string,
): Promise<SiteImageRecord | null> {
  return useAmplify() ? amplifyGetSiteImage(slot) : localGetSiteImage(slot);
}

export async function listSiteImageSlots(): Promise<string[]> {
  return useAmplify()
    ? amplifyListSiteImageSlots()
    : localListSiteImageSlots();
}

export async function saveSiteImage(
  slot: string,
  contentType: string,
  dataBase64: string,
): Promise<void> {
  return useAmplify()
    ? amplifySaveSiteImage(slot, contentType, dataBase64)
    : localSaveSiteImage(slot, contentType, dataBase64);
}

export async function deleteSiteImage(slot: string): Promise<void> {
  return useAmplify()
    ? amplifyDeleteSiteImage(slot)
    : localDeleteSiteImage(slot);
}
