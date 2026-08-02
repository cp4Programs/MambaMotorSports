"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/pay", label: "Pay Invoice" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[oklch(34%_0.02_255)] bg-[oklch(16%_0.015_255)] px-[5vw] py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 text-[var(--text)] hover:text-[var(--text)]">
          <Image
            src="/mambaMotorSportsLogo.jpg"
            alt="Mamba Motor Sports"
            width={44}
            height={44}
            className="rounded-full object-cover shadow-[0_0_0_2px_oklch(42%_0.16_305)]"
            priority
          />
          <span className="font-display text-[19px] font-bold leading-none tracking-[0.02em]">
            MAMBA
            <br />
            <span className="text-[11px] font-medium tracking-[0.28em] text-[oklch(78%_0.1_85)]">
              MOTOR SPORTS
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="rounded border border-[oklch(34%_0.02_255)] px-3 py-2 text-sm font-semibold md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          Menu
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } w-full flex-col items-start gap-4 md:flex md:w-auto md:flex-row md:items-center md:gap-7`}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-semibold tracking-[0.02em] text-[var(--text)] hover:text-[oklch(64%_0.14_305)] ${
                pathname === link.href ? "text-[oklch(64%_0.14_305)]" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="rounded bg-[oklch(50%_0.19_25)] px-[22px] py-[11px] text-sm font-bold tracking-[0.02em] text-[oklch(97%_0.004_260)] hover:bg-[oklch(43%_0.19_25)] hover:text-[oklch(97%_0.004_260)]"
          >
            Book a Service
          </Link>
        </nav>
      </div>
    </header>
  );
}
