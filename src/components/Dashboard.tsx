"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  confirmSignIn,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
} from "aws-amplify/auth";
import { Label, StatusPill, TextInput } from "@/components/ui";
import { configureAmplify } from "@/lib/amplify";

type Booking = {
  id: string;
  name: string;
  vehicle: string;
  serviceType: string;
  date: string;
  status: string;
};

type ContactMessage = {
  id: string;
  name: string;
  vehicle?: string | null;
  message: string;
  status: string;
};

type Invoice = {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: string;
};

type Tab = "inquiries" | "appointments" | "invoices";
type AuthMode = "cognito" | "local";

function statusTone(
  status: string,
): "new" | "pending" | "paid" | "overdue" | "neutral" | "success" {
  const s = status.toLowerCase();
  if (s === "new") return "new";
  if (s === "pending" || s === "confirmed") return "pending";
  if (s === "paid") return "paid";
  if (s === "completed" || s === "responded") return "success";
  if (s === "overdue") return "overdue";
  return "neutral";
}

export function Dashboard() {
  const [ready, setReady] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("local");
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("inquiries");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    async function boot() {
      const outputsRes = await fetch("/amplify_outputs.json", {
        cache: "no-store",
      }).catch(() => null);
      const hasOutputs = Boolean(outputsRes?.ok);

      if (hasOutputs) {
        await configureAmplify();
        try {
          await getCurrentUser();
          setAuthMode("cognito");
          setAuthed(true);
          setReady(true);
          return;
        } catch {
          setAuthMode("cognito");
        }
      } else {
        setAuthMode("local");
      }

      const saved = window.sessionStorage.getItem("mms_owner_token");
      if (saved) {
        setAuthMode("local");
        setToken(saved);
        setAuthed(true);
      }
      setReady(true);
    }
    void boot();
  }, []);

  const getToken = useCallback(async () => {
    if (authMode === "local") return token;
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || "";
  }, [authMode, token]);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    setLoginError("");
    try {
      const bearer = await getToken();
      if (!bearer) throw new Error("Not authenticated");

      const res = await fetch("/api/owner/summary", {
        headers: { Authorization: `Bearer ${bearer}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load dashboard");
      setBookings(data.bookings || []);
      setMessages(data.messages || []);
      setInvoices(data.invoices || []);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoadingData(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (authed) void loadData();
  }, [authed, loadData]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      if (authMode === "local") {
        const res = await fetch("/api/owner/dev-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        window.sessionStorage.setItem("mms_owner_token", data.token);
        setToken(data.token);
        setAuthed(true);
        return;
      }

      await configureAmplify();
      const result = await signIn({ username: email.trim(), password });
      if (
        result.nextStep.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setNeedsNewPassword(true);
        return;
      }
      if (result.isSignedIn) setAuthed(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    }
  }

  async function onConfirmPassword(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const result = await confirmSignIn({ challengeResponse: newPassword });
      if (result.isSignedIn) {
        setNeedsNewPassword(false);
        setAuthed(true);
      }
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "Could not set password",
      );
    }
  }

  async function onLogout() {
    if (authMode === "cognito") await signOut();
    window.sessionStorage.removeItem("mms_owner_token");
    setToken("");
    setAuthed(false);
    setEmail("");
    setPassword("");
  }

  if (!ready) {
    return <p className="text-panel-muted">Loading…</p>;
  }

  if (!authed) {
    return (
      <form
        onSubmit={needsNewPassword ? onConfirmPassword : onLogin}
        className="mx-auto max-w-md rounded-[10px] border border-panel-border bg-panel p-8 text-panel-text"
      >
        <h2 className="mb-2 font-display text-2xl font-semibold">Owner Login</h2>
        <p className="mb-6 text-sm text-panel-muted">
          {authMode === "local"
            ? "Local demo login (default password: mamba-owner). Cognito takes over after Amplify deploy."
            : "Sign in with your Cognito owner account."}
        </p>
        {!needsNewPassword ? (
          <>
            <div className="mb-4">
              <Label>Email</Label>
              <TextInput
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <Label>Password</Label>
              <TextInput
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="mb-6">
            <Label>Set a new password</Label>
            <TextInput
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        )}
        {loginError ? (
          <p className="mb-4 text-sm text-[oklch(45%_0.19_25)]">{loginError}</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-[4px] bg-orange py-3.5 text-sm font-bold text-fg hover:bg-orange-hover"
        >
          {needsNewPassword ? "Save password & continue" : "Sign in"}
        </button>
      </form>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "inquiries", label: "Inquiries" },
    { id: "appointments", label: "Appointments" },
    { id: "invoices", label: "Invoices" },
  ];

  return (
    <div className="rounded-[10px] border border-panel-border bg-panel p-6 text-panel-text md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold">Owner Dashboard</h2>
        <button
          type="button"
          onClick={onLogout}
          className="text-sm font-semibold text-purple hover:text-orange"
        >
          Sign out
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-4 py-2 text-sm font-semibold ${
              tab === t.id
                ? "bg-[oklch(20%_0.015_260)] text-fg"
                : "border border-panel-border bg-[oklch(97%_0.004_260)] text-[oklch(20%_0.015_260)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loadingData ? <p className="text-panel-muted">Refreshing…</p> : null}
      {loginError ? (
        <p className="mb-4 text-sm text-[oklch(45%_0.19_25)]">{loginError}</p>
      ) : null}

      {tab === "inquiries" ? (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-panel-muted">No inquiries yet.</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-panel-border p-4"
              >
                <div>
                  <div className="font-semibold">
                    {m.name}{" "}
                    <span className="font-normal text-panel-muted">
                      · {m.vehicle || "Vehicle n/a"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-panel-muted">{m.message}</p>
                </div>
                <StatusPill label={m.status} tone={statusTone(m.status)} />
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "appointments" ? (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <p className="text-panel-muted">No appointments yet.</p>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-panel-border p-4"
              >
                <div>
                  <div className="font-semibold">
                    {b.name}{" "}
                    <span className="font-normal text-panel-muted">
                      · {b.vehicle}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-panel-muted">
                    {b.serviceType} · {b.date}
                  </p>
                </div>
                <StatusPill label={b.status} tone={statusTone(b.status)} />
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "invoices" ? (
        <div className="space-y-3">
          {invoices.length === 0 ? (
            <p className="text-panel-muted">No invoices yet.</p>
          ) : (
            invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-panel-border p-4"
              >
                <div>
                  <div className="font-semibold">{inv.number}</div>
                  <p className="text-sm text-panel-muted">{inv.customer}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">
                    ${Number(inv.total).toFixed(2)}
                  </span>
                  <StatusPill label={inv.status} tone={statusTone(inv.status)} />
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
