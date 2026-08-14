"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { OwnerCms } from "@/components/OwnerCms";

type Tab = "website" | "inquiries" | "appointments" | "invoices";

type ContactRow = {
  id: string;
  name: string;
  vehicle: string;
  message: string;
  status: string;
};

type BookingRow = {
  id: string;
  name: string;
  make: string;
  model: string;
  serviceType: string;
  date: string;
  status: string;
};

type InvoiceRow = {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: string;
};

function statusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "new" || s === "confirmed" || s === "pending") {
    if (s === "pending")
      return {
        bg: "oklch(93% 0.03 85)",
        fg: "oklch(45% 0.09 85)",
      };
    return {
      bg: "oklch(93% 0.02 305)",
      fg: "oklch(38% 0.14 305)",
    };
  }
  if (s === "paid" || s === "completed" || s === "responded") {
    if (s === "paid")
      return { bg: "oklch(93% 0.05 155)", fg: "oklch(40% 0.1 155)" };
    return { bg: "oklch(92% 0.01 260)", fg: "oklch(40% 0.01 260)" };
  }
  if (s === "overdue")
    return { bg: "oklch(90% 0.05 25)", fg: "oklch(45% 0.19 25)" };
  return { bg: "oklch(92% 0.01 260)", fg: "oklch(40% 0.01 260)" };
}

export function OwnerDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("website");
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("mms_owner_token");
    if (saved) setToken(saved);
  }, []);

  const load = useCallback(async (authToken: string) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      const [c, b, i] = await Promise.all([
        fetch("/api/dashboard/contacts", { headers }).then((r) => r.json()),
        fetch("/api/dashboard/bookings", { headers }).then((r) => r.json()),
        fetch("/api/dashboard/invoices", { headers }).then((r) => r.json()),
      ]);
      if (c.error || b.error || i.error) {
        throw new Error(c.error || b.error || i.error || "Unauthorized");
      }
      setContacts(c.items ?? []);
      setBookings(b.items ?? []);
      setInvoices(i.items ?? []);
    } catch {
      sessionStorage.removeItem("mms_owner_token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) void load(token);
  }, [token, load]);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      sessionStorage.setItem("mms_owner_token", data.token);
      setToken(data.token);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    }
  }

  function logout() {
    sessionStorage.removeItem("mms_owner_token");
    setToken(null);
    setEmail("");
    setPassword("");
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-[380px] px-[6vw] py-24">
        <h1 className="font-display mb-2 text-center text-2xl font-bold">
          Owner Login
        </h1>
        <p className="mb-7 text-center text-sm text-[oklch(40%_0.015_260)]">
          Internal access only
        </p>
        <form
          onSubmit={login}
          className="flex flex-col gap-3.5 rounded-[10px] border border-[oklch(85%_0.006_260)] bg-[oklch(97%_0.004_260)] p-7"
        >
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-[5px] border border-[oklch(80%_0.006_260)] px-3 py-3 text-[15px]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-[5px] border border-[oklch(80%_0.006_260)] px-3 py-3 text-[15px]"
            />
          </label>
          {loginError ? (
            <p className="text-[13px] font-semibold text-[oklch(50%_0.19_25)]">
              {loginError}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-1 rounded-[5px] bg-[oklch(20%_0.015_260)] py-3.5 text-[15px] font-bold text-[oklch(97%_0.004_260)]"
          >
            Log In
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "website", label: "Website" },
    { id: "inquiries", label: "Inquiries" },
    { id: "appointments", label: "Appointments" },
    { id: "invoices", label: "Invoices" },
  ];

  return (
    <div className="px-[6vw] py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold">
          Owner Dashboard
        </h1>
        <button
          type="button"
          onClick={logout}
          className="rounded-[5px] border border-[oklch(60%_0.01_260)] bg-transparent px-[18px] py-2.5 text-[13px] font-semibold"
        >
          Log Out
        </button>
      </div>

      <div className="mb-7 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="rounded-[5px] border border-[oklch(80%_0.006_260)] px-[18px] py-2.5 text-[13px] font-semibold"
              style={{
                background: active ? "oklch(20% 0.015 260)" : "oklch(97% 0.004 260)",
                color: active ? "oklch(97% 0.004 260)" : "oklch(20% 0.015 260)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "website" && token ? <OwnerCms token={token} /> : null}

      {loading && tab !== "website" ? (
        <p className="text-sm text-[oklch(40%_0.015_260)]">Loading…</p>
      ) : null}

      {tab === "inquiries" ? (
        <Table
          headers={["NAME", "VEHICLE", "MESSAGE", "STATUS"]}
          cols="1.2fr 1fr 2fr 1fr"
          rows={contacts.map((row) => {
            const st = statusStyle(row.status);
            return [
              row.name,
              row.vehicle || "—",
              <span key="m" className="text-[oklch(45%_0.01_260)]">
                {row.message}
              </span>,
              <Badge key="s" bg={st.bg} fg={st.fg} label={row.status} />,
            ];
          })}
        />
      ) : null}

      {tab === "appointments" ? (
        <Table
          headers={["CUSTOMER", "VEHICLE", "SERVICE", "DATE", "STATUS"]}
          cols="1.2fr 1fr 1.4fr 1fr 1fr"
          rows={bookings.map((row) => {
            const st = statusStyle(row.status);
            return [
              row.name,
              `${row.make} ${row.model}`.trim(),
              row.serviceType,
              <span key="d" className="text-[oklch(45%_0.01_260)]">
                {row.date || "—"}
              </span>,
              <Badge key="s" bg={st.bg} fg={st.fg} label={row.status} />,
            ];
          })}
        />
      ) : null}

      {tab === "invoices" ? (
        <Table
          headers={["INVOICE #", "CUSTOMER", "AMOUNT", "STATUS"]}
          cols="1fr 1.2fr 1fr 1fr"
          rows={invoices.map((row) => {
            const st = statusStyle(row.status);
            return [
              row.number,
              row.customer,
              `$${row.total}`,
              <Badge key="s" bg={st.bg} fg={st.fg} label={row.status} />,
            ];
          })}
        />
      ) : null}
    </div>
  );
}

function Badge({ bg, fg, label }: { bg: string; fg: string; label: string }) {
  return (
    <span
      className="w-fit rounded-xl px-2.5 py-1 text-xs font-semibold"
      style={{ background: bg, color: fg }}
    >
      {label}
    </span>
  );
}

function Table({
  headers,
  cols,
  rows,
}: {
  headers: string[];
  cols: string;
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[oklch(85%_0.006_260)] bg-[oklch(97%_0.004_260)]">
      <div
        className="hidden border-b border-[oklch(85%_0.006_260)] px-5 py-3.5 text-xs font-bold tracking-[0.04em] text-[oklch(45%_0.01_260)] md:grid"
        style={{ gridTemplateColumns: cols }}
      >
        {headers.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className="px-5 py-8 text-sm text-[oklch(45%_0.01_260)]">No records yet.</div>
      ) : (
        rows.map((row, idx) => (
          <div
            key={idx}
            className="grid items-center gap-2 border-b border-[oklch(90%_0.006_260)] px-5 py-4 text-sm last:border-b-0 md:gap-0"
            style={{ gridTemplateColumns: cols }}
          >
            {row.map((cell, i) => (
              <div key={i}>{cell}</div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
