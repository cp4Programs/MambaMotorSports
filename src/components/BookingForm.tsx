"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Label, PrimaryButton, SelectInput, TextArea, TextInput } from "@/components/ui";
import { MAKES, SERVICE_NAMES, TIME_SLOTS } from "@/lib/data";

type BookingFormState = {
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

export function BookingForm() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("service") || SERVICE_NAMES[0];

  const [form, setForm] = useState<BookingFormState>({
    name: "",
    phone: "",
    email: "",
    make: "BMW",
    model: "",
    year: "",
    serviceType: SERVICE_NAMES.includes(prefill) ? prefill : SERVICE_NAMES[0],
    date: "",
    time: TIME_SLOTS[0],
    issue: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = useMemo(
    () => (field: keyof BookingFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

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
      if (!res.ok) throw new Error(data.error || "Could not submit booking.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[10px] border border-panel-border bg-panel p-8 text-panel-text">
        <h2 className="mb-3 font-display text-2xl font-semibold">
          Appointment requested
        </h2>
        <p className="mb-6 text-panel-muted leading-relaxed">
          Confirmation will be sent to {form.email}. We typically respond within
          4 business hours.
        </p>
        <PrimaryButton
          onClick={() => {
            setSubmitted(false);
            setForm((f) => ({
              ...f,
              name: "",
              phone: "",
              email: "",
              model: "",
              year: "",
              date: "",
              issue: "",
            }));
          }}
        >
          Book another
        </PrimaryButton>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[10px] border border-panel-border bg-panel p-8 text-panel-text"
    >
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Full name</Label>
          <TextInput required value={form.name} onChange={update("name")} />
        </div>
        <div>
          <Label>Phone</Label>
          <TextInput required value={form.phone} onChange={update("phone")} />
        </div>
      </div>
      <div className="mb-5">
        <Label>Email</Label>
        <TextInput
          type="email"
          required
          value={form.email}
          onChange={update("email")}
        />
      </div>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Make</Label>
          <SelectInput value={form.make} onChange={update("make")}>
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SelectInput>
        </div>
        <div>
          <Label>Model</Label>
          <TextInput required value={form.model} onChange={update("model")} />
        </div>
        <div>
          <Label>Year</Label>
          <TextInput required value={form.year} onChange={update("year")} />
        </div>
      </div>
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Service</Label>
          <SelectInput value={form.serviceType} onChange={update("serviceType")}>
            {SERVICE_NAMES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectInput>
        </div>
        <div>
          <Label>Preferred date</Label>
          <TextInput
            type="date"
            required
            value={form.date}
            onChange={update("date")}
          />
        </div>
      </div>
      <div className="mb-5">
        <Label>Preferred time</Label>
        <SelectInput value={form.time} onChange={update("time")}>
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectInput>
      </div>
      <div className="mb-6">
        <Label>What&apos;s going on?</Label>
        <TextArea
          required
          value={form.issue}
          onChange={update("issue")}
          placeholder="Describe the issue, noises, warning lights, etc."
        />
      </div>
      {error ? <p className="mb-4 text-sm text-[oklch(45%_0.19_25)]">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-[4px] bg-orange px-8 py-4 text-base font-bold text-fg transition-colors hover:bg-orange-hover disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Request Appointment"}
      </button>
    </form>
  );
}
