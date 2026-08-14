import type { ImageSlotId, SiteCopy, SiteService } from "@/lib/site";
import { DEFAULT_SITE_COPY, SITE_KEY, defaultServices } from "@/lib/site";

export function mergeSiteCopy(raw: unknown): SiteCopy {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const badges = Array.isArray(obj.badges)
    ? obj.badges.filter((b): b is string => typeof b === "string")
    : DEFAULT_SITE_COPY.badges;
  return {
    ...DEFAULT_SITE_COPY,
    ...Object.fromEntries(
      Object.entries(obj).filter(([, v]) => typeof v === "string"),
    ),
    badges: badges.length ? badges : DEFAULT_SITE_COPY.badges,
  };
}

export type SiteImageRecord = {
  id: string;
  slot: ImageSlotId | string;
  contentType: string;
  dataBase64: string;
};

export { SITE_KEY, defaultServices };
export type { SiteCopy, SiteService };
