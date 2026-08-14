"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { MAKES, SERVICE_NAMES, TIME_SLOTS } from "@/lib/content";

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  make: string;
  model: string;
  year: string;
  serviceType: string;
  date: string;
  time: string;
  issue: string;
};

const empty = (serviceType: string): BookingForm => ({
  name: "",
  phone: "",
  email: "",
  make: "BMW",
  model: "",
  year: "",
  serviceType,
  date: "",
  time: TIME_SLOTS[0],
  issue: "",
});

export function BookForm({ serviceNames }: { serviceNames: string[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const names = serviceNames.length ? serviceNames : SERVICE_NAMES;
  const initialService = useMemo(() => {
    const q = searchParams.get("service") ?? "";
    return names.includes(q) ? q : names[0];
  }, [searchParams, names]);

  const [form, setForm] = useState<BookingForm>(() => empty(initialService));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit booking");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-[oklch(85%_0.006_260)] border-l-4 border-l-[oklch(50%_0.19_25)] bg-[oklch(97%_0.004_260)] p-8">
        <h2 className="font-display mb-3 text-[22px] font-bold">Request received.</h2>
        <p className="mb-2 leading-relaxed">
          We&apos;ll confirm your <strong>{form.serviceType}</strong> appointment for
          your {form.make} {form.model} within one business day.
        </p>
        <p className="mb-6 text-sm text-[oklch(40%_0.015_260)]">
          Confirmation will be sent to {form.email}.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(empty(names[0]));
            router.replace("/book");
          }}
          className="rounded bg-[oklch(20%_0.015_260)] px-[22px] py-3 text-sm font-bold text-[oklch(97%_0.004_260)]"
        >
          Book Another
        </button>
      </div>
    );
  }

  const field =
    "rounded-[5px] border border-[oklch(80%_0.006_260)] px-3 py-3 text-[15px] text-[oklch(20%_0.015_260)]";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-[18px] rounded-[10px] border border-[oklch(85%_0.006_260)] bg-[oklch(97%_0.004_260)] p-8"
    >
      <div className="flex flex-wrap gap-4">
        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-[13px] font-semibold">
          Full Name
          <input
            required
            className={field}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>
        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-[13px] font-semibold">
          Phone
          <input
            required
            className={field}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        Email
        <input
          type="email"
          required
          className={field}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-4">
        <label className="flex min-w-[140px] flex-1 flex-col gap-1.5 text-[13px] font-semibold">
          Make
          <select
            className={field}
            value={form.make}
            onChange={(e) => update("make", e.target.value)}
          >
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[140px] flex-1 flex-col gap-1.5 text-[13px] font-semibold">
          Model
          <input
            className={field}
            placeholder="e.g. X5"
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
          />
        </label>
        <label className="flex min-w-[100px] flex-1 flex-col gap-1.5 text-[13px] font-semibold">
          Year
          <input
            className={field}
            placeholder="2019"
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        Service Type
        <select
          className={field}
          value={form.serviceType}
          onChange={(e) => update("serviceType", e.target.value)}
        >
          {names.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-4">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1.5 text-[13px] font-semibold">
          Preferred Date
          <input
            type="date"
            className={field}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </label>
        <label className="flex min-w-[200px] flex-1 flex-col gap-1.5 text-[13px] font-semibold">
          Preferred Time
          <select
            className={field}
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        What&apos;s going on?
        <textarea
          rows={4}
          className={`${field} resize-y`}
          placeholder="Describe the issue or service needed"
          value={form.issue}
          onChange={(e) => update("issue", e.target.value)}
        />
      </label>
      {error ? (
        <p className="text-sm font-semibold text-[oklch(50%_0.19_25)]">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-1.5 rounded-[5px] bg-[oklch(50%_0.19_25)] px-7 py-[15px] text-[15px] font-bold text-[oklch(97%_0.004_260)] hover:bg-[oklch(43%_0.19_25)] disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Request Appointment"}
      </button>
    </form>
  );
}
