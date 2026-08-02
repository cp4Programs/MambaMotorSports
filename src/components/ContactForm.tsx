"use client";

import { FormEvent, useState } from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  message: string;
};

const EMPTY: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send message");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-[oklch(85%_0.006_260)] border-l-4 border-l-[oklch(42%_0.16_305)] bg-[oklch(97%_0.004_260)] p-8">
        <h2 className="font-display mb-3 text-[22px] font-bold">Message sent.</h2>
        <p className="mb-6 leading-relaxed">
          Thanks, {form.name} — we&apos;ve got your message and will follow up at{" "}
          {form.email} soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(EMPTY);
          }}
          className="rounded bg-[oklch(20%_0.015_260)] px-[22px] py-3 text-sm font-bold text-[oklch(97%_0.004_260)]"
        >
          Send Another Message
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
          Name
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
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        Vehicle Details
        <input
          className={field}
          placeholder="e.g. 2020 BMW X5"
          value={form.vehicle}
          onChange={(e) => update("vehicle", e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        Message
        <textarea
          required
          rows={4}
          className={`${field} resize-y`}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </label>
      <div>
        <div className="mb-2 text-[13px] font-semibold">Photo (optional)</div>
        <ImagePlaceholder
          label="Photo of the issue (upload coming soon)"
          className="h-[140px] w-[180px] rounded-lg"
        />
      </div>
      {error ? (
        <p className="text-sm font-semibold text-[oklch(50%_0.19_25)]">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-1.5 rounded-[5px] bg-[oklch(42%_0.16_305)] px-7 py-[15px] text-[15px] font-bold text-[oklch(97%_0.004_260)] disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
