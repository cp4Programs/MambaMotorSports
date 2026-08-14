import { cache } from "react";
import { getSiteCopy, listSiteServices } from "@/server/repo";

export const loadPublishedSite = cache(async () => {
  const [copy, services] = await Promise.all([getSiteCopy(), listSiteServices()]);
  return { copy, services };
});
