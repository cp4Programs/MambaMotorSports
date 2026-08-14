import { DEFAULT_SITE_COPY, SITE_KEY, defaultServices } from "@/lib/site";
import type { SiteCopy, SiteService } from "@/lib/site";
import { getAmplifyDataClient, throwIfErrors } from "./amplify-client";
import { mergeSiteCopy, type SiteImageRecord } from "./site-utils";

function requireClient() {
  const client = getAmplifyDataClient();
  if (!client) {
    throw new Error("Amplify Data is not configured (missing amplify_outputs.json)");
  }
  return client;
}

export async function amplifyGetSiteCopy(): Promise<SiteCopy> {
  const client = requireClient();
  const { data, errors } = await client.models.SiteCopy.list({
    filter: { key: { eq: SITE_KEY } },
  });
  throwIfErrors(errors, "list SiteCopy");
  const row = data[0];
  if (!row?.json) return DEFAULT_SITE_COPY;
  try {
    return mergeSiteCopy(JSON.parse(row.json) as unknown);
  } catch {
    return DEFAULT_SITE_COPY;
  }
}

export async function amplifySaveSiteCopy(copy: SiteCopy): Promise<SiteCopy> {
  const client = requireClient();
  const merged = mergeSiteCopy(copy);
  const json = JSON.stringify(merged);
  const { data, errors } = await client.models.SiteCopy.list({
    filter: { key: { eq: SITE_KEY } },
  });
  throwIfErrors(errors, "list SiteCopy");
  const existing = data[0];
  if (existing) {
    const updated = await client.models.SiteCopy.update({
      id: existing.id,
      json,
    });
    throwIfErrors(updated.errors, "update SiteCopy");
  } else {
    const created = await client.models.SiteCopy.create({
      key: SITE_KEY,
      json,
    });
    throwIfErrors(created.errors, "create SiteCopy");
  }
  return merged;
}

export async function amplifyListSiteServices(): Promise<SiteService[]> {
  const client = requireClient();
  const { data, errors } = await client.models.SiteService.list();
  throwIfErrors(errors, "list SiteService");
  if (!data.length) {
    const seeded = defaultServices();
    for (const svc of seeded) {
      const created = await client.models.SiteService.create({
        name: svc.name,
        blurb: svc.blurb,
        price: svc.price,
        sortOrder: svc.sortOrder,
      });
      throwIfErrors(created.errors, "seed SiteService");
    }
    const again = await client.models.SiteService.list();
    throwIfErrors(again.errors, "list SiteService");
    return again.data
      .map((row) => ({
        id: row.id,
        name: row.name,
        blurb: row.blurb,
        price: row.price,
        sortOrder: row.sortOrder ?? 0,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return data
    .map((row) => ({
      id: row.id,
      name: row.name,
      blurb: row.blurb,
      price: row.price,
      sortOrder: row.sortOrder ?? 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function amplifySaveSiteServices(
  services: SiteService[],
): Promise<SiteService[]> {
  const client = requireClient();
  const existing = await client.models.SiteService.list();
  throwIfErrors(existing.errors, "list SiteService");
  const incomingIds = new Set(services.map((s) => s.id).filter(Boolean));

  for (const row of existing.data) {
    if (!incomingIds.has(row.id)) {
      const del = await client.models.SiteService.delete({ id: row.id });
      throwIfErrors(del.errors, "delete SiteService");
    }
  }

  const saved: SiteService[] = [];
  for (let i = 0; i < services.length; i++) {
    const svc = services[i];
    const payload = {
      name: svc.name.trim(),
      blurb: svc.blurb.trim(),
      price: svc.price.trim(),
      sortOrder: i,
    };
    const isExisting = existing.data.some((row) => row.id === svc.id);
    if (svc.id && isExisting) {
      const updated = await client.models.SiteService.update({
        id: svc.id,
        ...payload,
      });
      throwIfErrors(updated.errors, "update SiteService");
      if (updated.data) {
        saved.push({
          id: updated.data.id,
          name: updated.data.name,
          blurb: updated.data.blurb,
          price: updated.data.price,
          sortOrder: updated.data.sortOrder ?? i,
        });
      }
    } else {
      const created = await client.models.SiteService.create(payload);
      throwIfErrors(created.errors, "create SiteService");
      if (created.data) {
        saved.push({
          id: created.data.id,
          name: created.data.name,
          blurb: created.data.blurb,
          price: created.data.price,
          sortOrder: created.data.sortOrder ?? i,
        });
      }
    }
  }
  return saved;
}

export async function amplifyGetSiteImage(
  slot: string,
): Promise<SiteImageRecord | null> {
  const client = requireClient();
  const { data, errors } = await client.models.SiteImage.list({
    filter: { slot: { eq: slot } },
  });
  throwIfErrors(errors, "list SiteImage");
  const row = data[0];
  if (!row) return null;
  return {
    id: row.id,
    slot: row.slot,
    contentType: row.contentType,
    dataBase64: row.dataBase64,
  };
}

export async function amplifyListSiteImageSlots(): Promise<string[]> {
  const client = requireClient();
  const { data, errors } = await client.models.SiteImage.list();
  throwIfErrors(errors, "list SiteImage");
  return data.map((row) => row.slot);
}

export async function amplifySaveSiteImage(
  slot: string,
  contentType: string,
  dataBase64: string,
): Promise<void> {
  const client = requireClient();
  const { data, errors } = await client.models.SiteImage.list({
    filter: { slot: { eq: slot } },
  });
  throwIfErrors(errors, "list SiteImage");
  const existing = data[0];
  if (existing) {
    const updated = await client.models.SiteImage.update({
      id: existing.id,
      contentType,
      dataBase64,
    });
    throwIfErrors(updated.errors, "update SiteImage");
  } else {
    const created = await client.models.SiteImage.create({
      slot,
      contentType,
      dataBase64,
    });
    throwIfErrors(created.errors, "create SiteImage");
  }
}

export async function amplifyDeleteSiteImage(slot: string): Promise<void> {
  const client = requireClient();
  const { data, errors } = await client.models.SiteImage.list({
    filter: { slot: { eq: slot } },
  });
  throwIfErrors(errors, "list SiteImage");
  const existing = data[0];
  if (!existing) return;
  const del = await client.models.SiteImage.delete({ id: existing.id });
  throwIfErrors(del.errors, "delete SiteImage");
}
