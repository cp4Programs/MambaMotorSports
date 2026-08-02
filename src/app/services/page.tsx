import type { Metadata } from "next";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-[radial-gradient(ellipse_at_80%_20%,oklch(32%_0.15_305_/_0.3),transparent_55%),oklch(16%_0.015_255)] px-[6vw] pb-14 pt-20">
        <h1 className="font-display mb-3.5 text-[clamp(2rem,4vw,3rem)] font-bold">
          Services
        </h1>
        <p className="max-w-[640px] text-base leading-relaxed text-[oklch(78%_0.012_260)]">
          Built around BMW, Audi, and Mercedes-Benz — factory-informed work with
          straight answers on price.
        </p>
      </section>

      <div className="px-[6vw] pb-10">
        <ImagePlaceholder
          label="Workshop / bay photo coming soon"
          className="h-[260px] w-full"
        />
      </div>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 px-[6vw] pb-24">
        {SERVICES.map((svc) => (
          <div
            key={svc.name}
            className="flex flex-col rounded-[10px] border border-[oklch(34%_0.02_255)] bg-[oklch(27%_0.02_255)] p-7"
          >
            <h2 className="font-display mb-2.5 text-[19px] font-semibold">{svc.name}</h2>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-[oklch(78%_0.012_260)]">
              {svc.blurb}
            </p>
            <div className="mb-[18px] text-base font-bold text-[oklch(78%_0.1_85)]">
              {svc.price}
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href={`/book?service=${encodeURIComponent(svc.name)}`}
                className="rounded bg-[oklch(50%_0.19_25)] px-[18px] py-2.5 text-[13px] font-bold text-[oklch(97%_0.004_260)] hover:bg-[oklch(43%_0.19_25)] hover:text-[oklch(97%_0.004_260)]"
              >
                Book This Service
              </Link>
              <Link
                href="/contact"
                className="rounded border border-[oklch(34%_0.02_255)] bg-transparent px-[18px] py-2.5 text-[13px] font-semibold text-[oklch(64%_0.14_305)] hover:text-[oklch(50%_0.19_25)]"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
