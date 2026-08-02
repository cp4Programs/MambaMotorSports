"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
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
    <header className="sticky top-0 z-50 border-b border-border bg-bg-deep/95 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4 px-[5vw] py-3.5">
        <Link href="/" className="flex items-center gap-3 text-fg hover:text-fg">
          <Image
            src="/mambaMotorSportsLogo.jpg"
            alt="Mamba Motor Sports"
            width={44}
            height={44}
            className="rounded-full object-cover shadow-[0_0_0_2px_var(--purple-deep)]"
            priority
          />
          <div className="font-display text-[19px] font-bold leading-none tracking-wide">
            MAMBA
            <br />
            <span className="text-[11px] font-medium tracking-[0.28em] text-gold">
              MOTOR SPORTS
            </span>
          </div>
        </Link>

        <button
          type="button"
          className="rounded border border-border px-3 py-2 text-sm font-semibold md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } w-full flex-col items-start gap-4 md:flex md:w-auto md:flex-row md:items-center md:gap-7`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-semibold tracking-wide text-fg hover:text-purple ${
                pathname === link.href ? "text-purple" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="rounded-[4px] bg-orange px-[22px] py-[11px] text-sm font-bold tracking-wide text-fg transition-colors hover:bg-orange-hover hover:text-fg"
          >
            Book a Service
          </Link>
        </nav>
      </div>
    </header>
  );
}
