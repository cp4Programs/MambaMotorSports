import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-wide ${className}`}
    >
      {children}
    </h1>
  );
}

export function PrimaryButton({
  href,
  children,
  className = "",
  ...props
}: { href?: string; children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `inline-flex items-center justify-center rounded-[4px] bg-orange px-8 py-4 text-base font-bold tracking-wide text-fg transition-colors hover:bg-orange-hover hover:text-fg disabled:cursor-not-allowed disabled:opacity-60 ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-[4px] border border-border bg-transparent px-8 py-4 text-base font-semibold tracking-wide text-fg transition-colors hover:border-purple hover:text-fg ${className}`}
    >
      {children}
    </Link>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-panel-text">
      {children}
    </label>
  );
}

const fieldClass =
  "w-full rounded-[5px] border border-panel-border bg-white px-3 py-3 text-[15px] text-panel-text outline-none focus:border-purple";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldClass} {...props} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClass} {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClass} min-h-[120px] resize-y`} {...props} />;
}

export function ImageSlot({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[14px] border border-dashed border-border bg-[oklch(27%_0.02_255_/_0.5)] text-center text-sm text-muted ${className}`}
    >
      {label}
    </div>
  );
}

export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "new" | "pending" | "paid" | "overdue" | "neutral" | "success";
}) {
  const tones: Record<string, string> = {
    new: "bg-[oklch(93%_0.02_305)] text-[oklch(38%_0.14_305)]",
    pending: "bg-[oklch(93%_0.03_85)] text-[oklch(45%_0.09_85)]",
    paid: "bg-[oklch(93%_0.05_155)] text-[oklch(40%_0.1_155)]",
    overdue: "bg-[oklch(90%_0.05_25)] text-[oklch(45%_0.19_25)]",
    success: "bg-[oklch(93%_0.05_155)] text-[oklch(40%_0.1_155)]",
    neutral: "bg-[oklch(92%_0.01_260)] text-[oklch(40%_0.01_260)]",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {label}
    </span>
  );
}
