"use client";

import { FormEvent, useState } from "react";

type InvoiceItem = { desc: string; amt: number };

type InvoiceResult = {
  number: string;
  customer: string;
  vehicle: string;
  items: InvoiceItem[];
  tax: number;
  total: number;
  status: string;
};

export function PayInvoice() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  async function lookup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const number = input.trim().toUpperCase();
      const res = await fetch(`/api/invoices/${encodeURIComponent(number)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invoice not found");
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `No invoice found for "${input}". Try MMS-1042 or MMS-1077.`,
      );
    } finally {
      setLoading(false);
    }
  }

  async function pay() {
    if (!result) return;
    setPaying(true);
    setError("");
    try {
      const res = await fetch(
        `/api/invoices/${encodeURIComponent(result.number)}/checkout`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start checkout");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  }

  return (
    <div>
      <form onSubmit={lookup} className="mb-6 flex flex-wrap gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Invoice number, e.g. MMS-1042"
          className="min-w-[220px] flex-1 rounded-[5px] border border-[oklch(80%_0.006_260)] px-3.5 py-3.5 text-[15px] text-[oklch(20%_0.015_260)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-[5px] bg-[oklch(20%_0.015_260)] px-[26px] py-3.5 text-sm font-bold text-[oklch(97%_0.004_260)] disabled:opacity-60"
        >
          {loading ? "Looking up…" : "Look Up"}
        </button>
      </form>

      {error ? (
        <p className="mb-5 text-sm font-semibold text-[oklch(50%_0.19_25)]">{error}</p>
      ) : null}

      {result ? (
        <div className="rounded-[10px] border border-[oklch(85%_0.006_260)] bg-[oklch(93%_0.006_260)] p-7">
          <div className="mb-5 flex flex-wrap justify-between gap-2">
            <div>
              <div className="font-display text-lg font-bold">
                Invoice {result.number}
              </div>
              <div className="text-[13px] text-[oklch(40%_0.015_260)]">
                {result.customer} · {result.vehicle}
              </div>
            </div>
            <span className="h-fit rounded-full bg-[oklch(93%_0.03_85)] px-2.5 py-1 text-xs font-semibold text-[oklch(45%_0.09_85)]">
              {result.status}
            </span>
          </div>
          <div className="mb-2 border-t border-[oklch(85%_0.006_260)] pt-4">
            {result.items.map((li) => (
              <div
                key={li.desc}
                className="flex justify-between py-2 text-sm"
              >
                <span>{li.desc}</span>
                <span className="font-semibold">${li.amt}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-[oklch(85%_0.006_260)] pt-3 text-sm text-[oklch(40%_0.015_260)]">
            <span>Tax</span>
            <span>${result.tax}</span>
          </div>
          <div className="mb-6 flex justify-between pt-3 text-[19px] font-bold">
            <span>Total Due</span>
            <span>${result.total}</span>
          </div>
          {result.status === "Paid" ? (
            <p className="text-sm font-semibold text-[oklch(40%_0.1_155)]">
              This invoice is already paid in full.
            </p>
          ) : (
            <button
              type="button"
              onClick={pay}
              disabled={paying}
              className="w-full rounded-[5px] bg-[oklch(50%_0.19_25)] py-4 text-[15px] font-bold text-[oklch(97%_0.004_260)] hover:bg-[oklch(43%_0.19_25)] disabled:opacity-60"
            >
              {paying ? "Redirecting…" : `Pay $${result.total} Now`}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
