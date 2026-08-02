import Link from "next/link";
import { HOURS, REGION } from "@/lib/data";

export function Footer() {
  return (
    <footer>
      <div className="flex flex-wrap gap-10 bg-bg-deep px-[6vw] py-14">
        <div className="min-w-[220px] flex-[2_1_280px]">
          <div className="mb-3 font-display text-xl font-bold tracking-wide">
            MAMBA MOTOR SPORTS
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            BMW · Audi · Mercedes-Benz specialists serving {REGION}. Precision
            work, transparent pricing, and a Mamba Mentality under the hood.
          </p>
        </div>
        <div className="min-w-[160px] flex-1">
          <div className="mb-3.5 text-[13px] font-bold tracking-wide text-muted">
            HOURS
          </div>
          <div className="flex flex-col gap-2 text-[13px] text-muted">
            <span>{HOURS.weekdays}</span>
            <span>{HOURS.saturday}</span>
            <span>{HOURS.sunday}</span>
          </div>
        </div>
        <div className="min-w-[160px] flex-1">
          <div className="mb-3.5 text-[13px] font-bold tracking-wide text-muted">
            QUICK LINKS
          </div>
          <div className="flex flex-col gap-2.5 text-[13px]">
            <Link href="/services" className="text-muted hover:text-purple">
              Services
            </Link>
            <Link href="/book" className="text-muted hover:text-purple">
              Book a Service
            </Link>
            <Link href="/pay" className="text-muted hover:text-purple">
              Pay Invoice
            </Link>
            <Link href="/dashboard" className="text-purple hover:text-orange">
              Owner Login
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-bg-deep px-[6vw] py-4 text-center text-xs text-[oklch(45%_0.01_260)]">
        © {new Date().getFullYear()} Mamba Motor Sports. All rights reserved.
      </div>
    </footer>
  );
}
