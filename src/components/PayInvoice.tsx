"use client";

import { FormEvent, useState } from "react";
import { Label, TextInput } from "@/components/ui";

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
      if (!res.ok) throw new Error(data.error || "Invoice not found.");
      setResult(data.invoice);
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
      if (!res.ok) throw new Error(data.error || "Could not start checkout.");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed to start.");
      setPaying(false);
    }
  }

  return (
    <div className="rounded-[10px] border border-panel-border bg-panel p-8 text-panel-text">
      <p className="mb-9 text-[15px] text-panel-muted">
        Enter your invoice number to view and pay your balance securely. Demo
        invoices: <strong>MMS-1042</strong> or <strong>MMS-1077</strong>.
      </p>

      <form onSubmit={lookup} className="mb-8 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-[1_1_220px]">
          <Label>Invoice number</Label>
          <TextInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Invoice number, e.g. MMS-1042"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-[4px] bg-purple-deep px-6 py-3 text-sm font-bold text-fg hover:bg-purple disabled:opacity-60"
          >
            {loading ? "Looking up…" : "Look up"}
          </button>
        </div>
      </form>

      {error ? <p className="mb-6 text-sm text-[oklch(45%_0.19_25)]">{error}</p> : null}

      {result ? (
        <div className="rounded-[8px] border border-panel-border p-6">
          {result.status === "Paid" ? (
            <div>
              <h2 className="mb-2 font-display text-xl font-semibold text-[oklch(40%_0.1_155)]">
                Paid in full
              </h2>
              <p className="text-panel-muted">
                Invoice {result.number} is already paid. A receipt was emailed
                when payment cleared.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="font-display text-xl font-semibold">
                    Invoice {result.number}
                  </div>
                  <div className="text-sm text-panel-muted">
                    {result.customer} · {result.vehicle}
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-[oklch(45%_0.09_85)]">
                  ${result.total.toFixed(2)}
                </div>
              </div>
              <ul className="mb-4 space-y-2 border-y border-panel-border py-4">
                {result.items.map((item) => (
                  <li
                    key={`${item.desc}-${item.amt}`}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span>{item.desc}</span>
                    <span>${item.amt.toFixed(2)}</span>
                  </li>
                ))}
                <li className="flex justify-between gap-4 text-sm text-panel-muted">
                  <span>Tax</span>
                  <span>${result.tax.toFixed(2)}</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={pay}
                disabled={paying}
                className="rounded-[4px] bg-orange px-8 py-4 text-base font-bold text-fg hover:bg-orange-hover disabled:opacity-60"
              >
                {paying ? "Redirecting to Stripe…" : "Pay Now"}
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
