"use client";

import { FormEvent, useState } from "react";
import { ImageSlot, Label, TextArea, TextInput } from "@/components/ui";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  message: string;
};

const empty: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof ContactFormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
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
      if (!res.ok) throw new Error(data.error || "Could not send message.");
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
        <h2 className="mb-3 font-display text-2xl font-semibold">Message sent</h2>
        <p className="mb-6 leading-relaxed text-panel-muted">
          Thanks, {form.name} — we&apos;ve got your message and will follow up
          at {form.email} soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(empty);
          }}
          className="rounded-[4px] bg-orange px-8 py-4 text-base font-bold text-fg hover:bg-orange-hover"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
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
            <TextInput value={form.phone} onChange={update("phone")} />
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
        <div className="mb-5">
          <Label>Vehicle (optional)</Label>
          <TextInput
            value={form.vehicle}
            onChange={update("vehicle")}
            placeholder="e.g. 2019 BMW 330i"
          />
        </div>
        <div className="mb-6">
          <Label>Message</Label>
          <TextArea required value={form.message} onChange={update("message")} />
        </div>
        {error ? <p className="mb-4 text-sm text-[oklch(45%_0.19_25)]">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-[4px] bg-orange px-8 py-4 text-base font-bold text-fg hover:bg-orange-hover disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send Message"}
        </button>
        <p className="mt-4 text-sm text-panel-muted">
          We typically respond within 4 business hours.
        </p>
      </form>
      <ImageSlot label="Shop / contact photo coming soon" className="min-h-[320px]" />
    </div>
  );
}
