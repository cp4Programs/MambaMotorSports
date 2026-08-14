"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ImageSlotId, SiteCopy, SiteService } from "@/lib/site";
import { IMAGE_SLOTS } from "@/lib/site";

type Props = {
  token: string;
};

const field =
  "rounded-[5px] border border-[oklch(80%_0.006_260)] px-3 py-2.5 text-[15px]";

export function OwnerCms({ token }: Props) {
  const [tab, setTab] = useState<"website" | "services" | "photos">("website");
  const [copy, setCopy] = useState<SiteCopy | null>(null);
  const [services, setServices] = useState<SiteService[]>([]);
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  async function reload() {
    setLoading(true);
    setError("");
    try {
      const [siteRes, svcRes, mediaRes] = await Promise.all([
        fetch("/api/dashboard/site", { headers }),
        fetch("/api/dashboard/services", { headers }),
        fetch("/api/dashboard/media", { headers }),
      ]);
      const site = await siteRes.json();
      const svc = await svcRes.json();
      const media = await mediaRes.json();
      if (!siteRes.ok) throw new Error(site.error || "Could not load site");
      if (!svcRes.ok) throw new Error(svc.error || "Could not load services");
      if (!mediaRes.ok) throw new Error(media.error || "Could not load photos");
      setCopy(site.copy);
      setServices(svc.items ?? []);
      const next: Record<string, boolean> = {};
      for (const slot of media.slots ?? []) next[slot.id] = Boolean(slot.filled);
      setFilled(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function updateCopy<K extends keyof SiteCopy>(key: K, value: SiteCopy[K]) {
    setCopy((c) => (c ? { ...c, [key]: value } : c));
  }

  async function saveCopy(e: FormEvent) {
    e.preventDefault();
    if (!copy) return;
    setStatus("");
    setError("");
    const res = await fetch("/api/dashboard/site", {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(copy),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    setCopy(data.copy);
    setStatus("Website text saved. Refresh the public site to see it.");
  }

  async function saveServices(e: FormEvent) {
    e.preventDefault();
    setStatus("");
    setError("");
    const res = await fetch("/api/dashboard/services", {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(services),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    setServices(data.items ?? []);
    setStatus("Services saved.");
  }

  async function onPhoto(slot: ImageSlotId, file: File) {
    setStatus("");
    setError("");
    try {
      const { contentType, dataBase64 } = await compressImage(file);
      const res = await fetch(`/api/dashboard/media/${slot}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, dataBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setFilled((f) => ({ ...f, [slot]: true }));
      setStatus("Photo updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  async function removePhoto(slot: ImageSlotId) {
    setStatus("");
    setError("");
    const res = await fetch(`/api/dashboard/media/${slot}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not remove photo");
      return;
    }
    setFilled((f) => ({ ...f, [slot]: false }));
    setStatus("Photo removed.");
  }

  if (loading) return <p className="text-sm text-[oklch(40%_0.015_260)]">Loading website…</p>;
  if (!copy) return <p className="text-sm text-[oklch(50%_0.19_25)]">{error || "No data"}</p>;

  const tabs = [
    { id: "website" as const, label: "Website text" },
    { id: "services" as const, label: "Services" },
    { id: "photos" as const, label: "Photos" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="rounded-[5px] border border-[oklch(80%_0.006_260)] px-4 py-2 text-[13px] font-semibold"
            style={{
              background: tab === t.id ? "oklch(20% 0.015 260)" : "oklch(97% 0.004 260)",
              color: tab === t.id ? "oklch(97% 0.004 260)" : "oklch(20% 0.015 260)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mb-4 text-sm font-semibold text-[oklch(50%_0.19_25)]">{error}</p>
      ) : null}
      {status ? (
        <p className="mb-4 text-sm font-semibold text-[oklch(38%_0.1_155)]">{status}</p>
      ) : null}

      {tab === "website" ? (
        <form onSubmit={saveCopy} className="flex max-w-[720px] flex-col gap-4">
          <Section title="Home hero">
            <Field label="Eyebrow" value={copy.heroEyebrow} onChange={(v) => updateCopy("heroEyebrow", v)} />
            <Field label="Accent title" value={copy.heroTitleAccent} onChange={(v) => updateCopy("heroTitleAccent", v)} />
            <Field label="Title rest" value={copy.heroTitleRest} onChange={(v) => updateCopy("heroTitleRest", v)} />
            <Area label="Hero paragraph" value={copy.heroBody} onChange={(v) => updateCopy("heroBody", v)} />
          </Section>
          <Section title="About">
            <Field label="Headline" value={copy.aboutHeadline} onChange={(v) => updateCopy("aboutHeadline", v)} />
            <Area label="Intro" value={copy.aboutBody} onChange={(v) => updateCopy("aboutBody", v)} />
            <Field label="Founder heading" value={copy.founderName} onChange={(v) => updateCopy("founderName", v)} />
            <Area label="Founder bio 1" value={copy.founderBio1} onChange={(v) => updateCopy("founderBio1", v)} />
            <Area label="Founder bio 2" value={copy.founderBio2} onChange={(v) => updateCopy("founderBio2", v)} />
            <Field
              label="Badges (comma-separated)"
              value={copy.badges.join(", ")}
              onChange={(v) =>
                updateCopy(
                  "badges",
                  v.split(",").map((b) => b.trim()).filter(Boolean),
                )
              }
            />
          </Section>
          <Section title="Contact & hours">
            <Field label="Phone" value={copy.phone} onChange={(v) => updateCopy("phone", v)} />
            <Field label="Public email" value={copy.email} onChange={(v) => updateCopy("email", v)} />
            <Field label="Address / service area" value={copy.address} onChange={(v) => updateCopy("address", v)} />
            <Field label="Weekday hours" value={copy.hoursWeekdays} onChange={(v) => updateCopy("hoursWeekdays", v)} />
            <Field label="Saturday hours" value={copy.hoursSaturday} onChange={(v) => updateCopy("hoursSaturday", v)} />
            <Field label="Sunday hours" value={copy.hoursSunday} onChange={(v) => updateCopy("hoursSunday", v)} />
            <Area label="Contact intro" value={copy.contactIntro} onChange={(v) => updateCopy("contactIntro", v)} />
            <Field
              label="Response note"
              value={copy.contactResponseNote}
              onChange={(v) => updateCopy("contactResponseNote", v)}
            />
            <Area
              label="Services page intro"
              value={copy.servicePageIntro}
              onChange={(v) => updateCopy("servicePageIntro", v)}
            />
          </Section>
          <button
            type="submit"
            className="rounded-[5px] bg-[oklch(20%_0.015_260)] py-3 text-[15px] font-bold text-[oklch(97%_0.004_260)]"
          >
            Save website text
          </button>
        </form>
      ) : null}

      {tab === "services" ? (
        <form onSubmit={saveServices} className="flex max-w-[720px] flex-col gap-4">
          {services.map((svc, idx) => (
            <div
              key={svc.id || idx}
              className="rounded-lg border border-[oklch(85%_0.006_260)] bg-[oklch(97%_0.004_260)] p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.04em] text-[oklch(45%_0.01_260)]">
                  SERVICE {idx + 1}
                </span>
                <button
                  type="button"
                  className="text-[13px] font-semibold text-[oklch(50%_0.19_25)]"
                  onClick={() => setServices((list) => list.filter((_, i) => i !== idx))}
                >
                  Delete
                </button>
              </div>
              <Field
                label="Name"
                value={svc.name}
                onChange={(v) =>
                  setServices((list) => list.map((s, i) => (i === idx ? { ...s, name: v } : s)))
                }
              />
              <Area
                label="Description"
                value={svc.blurb}
                onChange={(v) =>
                  setServices((list) => list.map((s, i) => (i === idx ? { ...s, blurb: v } : s)))
                }
              />
              <Field
                label="Price"
                value={svc.price}
                onChange={(v) =>
                  setServices((list) => list.map((s, i) => (i === idx ? { ...s, price: v } : s)))
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="rounded-[5px] border border-[oklch(60%_0.01_260)] py-2.5 text-[13px] font-semibold"
            onClick={() =>
              setServices((list) => [
                ...list,
                {
                  id: `new_${Date.now()}`,
                  name: "New service",
                  blurb: "Describe this service.",
                  price: "$0",
                  sortOrder: list.length,
                },
              ])
            }
          >
            Add service
          </button>
          <button
            type="submit"
            className="rounded-[5px] bg-[oklch(20%_0.015_260)] py-3 text-[15px] font-bold text-[oklch(97%_0.004_260)]"
          >
            Save services
          </button>
        </form>
      ) : null}

      {tab === "photos" ? (
        <div className="grid max-w-[900px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {IMAGE_SLOTS.map((slot) => (
            <div
              key={slot.id}
              className="rounded-lg border border-[oklch(85%_0.006_260)] bg-[oklch(97%_0.004_260)] p-4"
            >
              <p className="mb-3 text-[13px] font-semibold">{slot.label}</p>
              {filled[slot.id] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/media/${slot.id}?t=${Date.now()}`}
                  alt={slot.label}
                  className="mb-3 h-40 w-full rounded object-cover"
                />
              ) : (
                <div className="mb-3 flex h-40 items-center justify-center rounded border border-dashed border-[oklch(80%_0.006_260)] text-sm text-[oklch(45%_0.01_260)]">
                  No photo yet
                </div>
              )}
              <label className="mb-2 block cursor-pointer rounded-[5px] bg-[oklch(20%_0.015_260)] py-2 text-center text-[13px] font-bold text-[oklch(97%_0.004_260)]">
                {filled[slot.id] ? "Replace photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onPhoto(slot.id, file);
                    e.target.value = "";
                  }}
                />
              </label>
              {filled[slot.id] ? (
                <button
                  type="button"
                  className="w-full text-[13px] font-semibold text-[oklch(50%_0.19_25)]"
                  onClick={() => void removePhoto(slot.id)}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-[oklch(85%_0.006_260)] bg-[oklch(97%_0.004_260)] p-4">
      <legend className="px-1 text-xs font-bold tracking-[0.04em] text-[oklch(45%_0.01_260)]">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-[13px] font-semibold">
      {label}
      <input className={field} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-[13px] font-semibold">
      {label}
      <textarea
        rows={4}
        className={`${field} resize-y`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

async function compressImage(file: File): Promise<{ contentType: string; dataBase64: string }> {
  const bitmap = await createImageBitmap(file);
  const max = 1400;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.72),
  );
  if (!blob) throw new Error("Could not compress image");
  if (blob.size > 280_000) {
    throw new Error("Photo is still too large. Try a smaller image.");
  }
  const dataBase64 = await blobToBase64(blob);
  return { contentType: "image/jpeg", dataBase64 };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(blob);
  });
}
