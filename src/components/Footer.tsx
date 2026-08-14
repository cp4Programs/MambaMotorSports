import Image from "next/image";
import Link from "next/link";
import { loadPublishedSite } from "@/server/published-site";

export async function Footer() {
  const { copy } = await loadPublishedSite();
  return (
    <footer>
      <div className="flex flex-wrap justify-between gap-10 border-t border-[oklch(34%_0.02_255)] bg-[oklch(16%_0.015_255)] px-[6vw] pb-8 pt-14">
        <div className="min-w-[240px] flex-1">
          <div className="mb-3.5 flex items-center gap-2.5">
            <Image
              src="/mambaMotorSportsLogo.jpg"
              alt="Mamba Motor Sports"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div className="font-display text-sm font-bold tracking-[0.02em]">
              MAMBA <span className="text-[oklch(78%_0.1_85)]">MOTOR SPORTS</span>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-[oklch(78%_0.012_260)]">
            {copy.address || "Los Angeles & Orange County"}
            <br />
            BMW · Audi · Mercedes-Benz specialists
            {copy.phone ? (
              <>
                <br />
                {copy.phone}
              </>
            ) : null}
            {copy.email ? (
              <>
                <br />
                {copy.email}
              </>
            ) : null}
          </p>
        </div>

        <div className="min-w-[180px] flex-1">
          <div className="mb-3.5 text-[13px] font-bold tracking-[0.04em] text-[oklch(78%_0.012_260)]">
            HOURS
          </div>
          <div className="text-[13px] leading-[1.8] text-[oklch(78%_0.012_260)]">
            {copy.hoursWeekdays}
            <br />
            {copy.hoursSaturday}
            <br />
            {copy.hoursSunday}
          </div>
        </div>

        <div className="min-w-[180px] flex-1">
          <div className="mb-3.5 text-[13px] font-bold tracking-[0.04em] text-[oklch(78%_0.012_260)]">
            QUICK LINKS
          </div>
          <div className="flex flex-col gap-2.5 text-[13px] text-[oklch(78%_0.012_260)]">
            <Link href="/services" className="text-[oklch(78%_0.012_260)] hover:text-[oklch(64%_0.14_305)]">
              Services
            </Link>
            <Link href="/book" className="text-[oklch(78%_0.012_260)] hover:text-[oklch(64%_0.14_305)]">
              Book a Service
            </Link>
            <Link href="/pay" className="text-[oklch(78%_0.012_260)] hover:text-[oklch(64%_0.14_305)]">
              Pay Invoice
            </Link>
            <Link href="/dashboard" className="text-[oklch(64%_0.14_305)] hover:text-[oklch(50%_0.19_25)]">
              Owner Login
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[oklch(34%_0.02_255)] bg-[oklch(16%_0.015_255)] px-[6vw] py-[18px] text-center text-xs text-[oklch(45%_0.01_260)]">
        © {new Date().getFullYear()} Mamba Motor Sports. All rights reserved.
      </div>
    </footer>
  );
}
