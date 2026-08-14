import { SERVICES, TESTIMONIALS, HOURS } from "@/lib/content";

export const SITE_KEY = "default";

export const IMAGE_SLOTS = [
  { id: "about-founder", label: "Jorge / shop portrait (About)" },
  { id: "shop-1", label: "Shop photo 1 (About)" },
  { id: "shop-2", label: "Shop photo 2 (About)" },
  { id: "services-banner", label: "Services page banner" },
] as const;

export type ImageSlotId = (typeof IMAGE_SLOTS)[number]["id"];

export type SiteService = {
  id: string;
  name: string;
  blurb: string;
  price: string;
  sortOrder: number;
};

export type SiteCopy = {
  heroEyebrow: string;
  heroTitleAccent: string;
  heroTitleRest: string;
  heroBody: string;
  aboutHeadline: string;
  aboutBody: string;
  founderName: string;
  founderBio1: string;
  founderBio2: string;
  badges: string[];
  hoursWeekdays: string;
  hoursSaturday: string;
  hoursSunday: string;
  contactIntro: string;
  contactResponseNote: string;
  phone: string;
  email: string;
  address: string;
  servicePageIntro: string;
};

export const DEFAULT_SITE_COPY: SiteCopy = {
  heroEyebrow: "BMW · AUDI · MERCEDES-BENZ SPECIALISTS",
  heroTitleAccent: "Mamba Mentality",
  heroTitleRest: "Under the Hood.",
  heroBody:
    "Precision diagnostics, relentless attention to detail, and transparent pricing for the cars that demand it. We take your repair as seriously as you do.",
  aboutHeadline: "The Mamba Mentality, Under the Hood",
  aboutBody:
    "Named in tribute to Kobe Bryant's Black Mamba persona — the same relentless focus, discipline, and refusal to cut corners, applied to every BMW, Audi, and Mercedes-Benz that comes through our bay.",
  founderName: "Meet Jorge Acosta",
  founderBio1:
    "Jorge founded Mamba Motor Sports to bring dealer-level precision to independent repair — serving Los Angeles and Orange County owners who expect their BMW, Audi, or Mercedes to be handled by someone who actually knows the platform.",
  founderBio2:
    "Every job in the shop is measured against the same standard: precision, discipline, and relentless attention to detail — the Mamba Mentality.",
  badges: ["ASE Certified", "German Import Specialist", "Los Angeles & Orange County"],
  hoursWeekdays: HOURS.weekdays,
  hoursSaturday: HOURS.saturday,
  hoursSunday: HOURS.sunday,
  contactIntro: "Questions, quotes, or just want to talk shop — send us a message.",
  contactResponseNote: "We typically respond within 4 business hours.",
  phone: "",
  email: "",
  address: "Los Angeles & Orange County",
  servicePageIntro:
    "Built around BMW, Audi, and Mercedes-Benz — factory-informed work with straight answers on price.",
};

export function defaultServices(): SiteService[] {
  return SERVICES.map((s, i) => ({
    id: `svc-seed-${i}`,
    name: s.name,
    blurb: s.blurb,
    price: s.price,
    sortOrder: i,
  }));
}

export { TESTIMONIALS };
