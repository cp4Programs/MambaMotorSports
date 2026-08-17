"use client";

import { FormEvent, useState } from "react";

type Props = {
  token: string;
};

const MIN_LENGTH = 10;

const field =
  "rounded-[5px] border border-[oklch(80%_0.006_260)] px-3 py-2.5 text-[15px]";

export function OwnerPasswordForm({ token }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not change password");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus("Password updated. Use it the next time you log in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-w-[420px] flex-col gap-3.5 rounded-[10px] border border-[oklch(85%_0.006_260)] bg-[oklch(97%_0.004_260)] p-7"
    >
      <div>
        <h2 className="font-display text-lg font-semibold">Change password</h2>
        <p className="mt-1 text-[13px] text-[oklch(40%_0.015_260)]">
          At least {MIN_LENGTH} characters. Your login email stays the same.
        </p>
      </div>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        Current password
        <input
          type="password"
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={field}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        New password
        <input
          type="password"
          required
          minLength={MIN_LENGTH}
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={field}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        Confirm new password
        <input
          type="password"
          required
          minLength={MIN_LENGTH}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={field}
        />
      </label>
      {error ? (
        <p className="text-[13px] font-semibold text-[oklch(50%_0.19_25)]">{error}</p>
      ) : null}
      {status ? (
        <p className="text-[13px] font-semibold text-[oklch(40%_0.1_155)]">{status}</p>
      ) : null}
      <button
        type="submit"
        disabled={saving}
        className="mt-1 rounded-[5px] bg-[oklch(20%_0.015_260)] py-3 text-[15px] font-bold text-[oklch(97%_0.004_260)] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
