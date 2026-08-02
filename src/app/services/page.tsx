import Link from "next/link";
import { ImageSlot, SectionHeading } from "@/components/ui";
import { SERVICES } from "@/lib/data";

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <div className="px-[6vw] py-16">
      <SectionHeading className="mb-3">Services & Pricing</SectionHeading>
      <p className="mb-10 max-w-2xl text-muted">
        Upfront ranges for BMW, Audi, and Mercedes-Benz. Final quotes confirmed
        after inspection — no surprise line items.
      </p>

      <ImageSlot
        label="Workshop / bay photo coming soon"
        className="mb-10 h-[260px] w-full"
      />

      <div className="grid gap-5">
        {SERVICES.map((svc) => (
          <article
            key={svc.name}
            className="flex flex-wrap items-start justify-between gap-6 rounded-[10px] border border-border bg-bg-elevated p-7"
          >
            <div className="min-w-[260px] flex-[2_1_360px]">
              <h2 className="mb-2 font-display text-xl font-semibold">{svc.name}</h2>
              <p className="mb-3 text-[15px] leading-relaxed text-muted">
                {svc.blurb}
              </p>
              <div className="text-[15px] font-bold text-gold">{svc.price}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/book?service=${encodeURIComponent(svc.name)}`}
                className="rounded-[4px] bg-orange px-5 py-3 text-sm font-bold text-fg hover:bg-orange-hover hover:text-fg"
              >
                Book This Service
              </Link>
              <Link
                href="/contact"
                className="rounded-[4px] border border-border px-5 py-3 text-sm font-semibold text-fg hover:border-purple hover:text-fg"
              >
                Ask a Question
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
