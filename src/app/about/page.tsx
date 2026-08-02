import { ImageSlot, SectionHeading } from "@/components/ui";
import { REGION } from "@/lib/data";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="px-[6vw] py-16">
      <SectionHeading className="mb-3">About Mamba Motor Sports</SectionHeading>
      <p className="mb-12 max-w-2xl text-muted">
        Named for the Black Mamba&apos;s focus and relentless work ethic — the
        same standard we bring to every BMW, Audi, and Mercedes that rolls into
        the bay.
      </p>

      <div className="mb-14 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="mb-4 font-display text-2xl font-semibold">
            Meet Jorge Acosta
          </h2>
          <p className="mb-3.5 text-[15px] leading-relaxed text-muted">
            Jorge founded Mamba Motor Sports to bring dealer-level precision to
            independent repair — serving {REGION} owners who expect their BMW,
            Audi, or Mercedes to be handled by someone who actually knows the
            platform.
          </p>
          <p className="text-[15px] leading-relaxed text-muted">
            No shortcuts. No mystery invoices. Just honest diagnostics and work
            done right the first time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["ASE Certified", "German Import Focus", "LA & OC"].map((badge) => (
              <span
                key={badge}
                className="rounded border border-border px-3 py-1.5 text-xs font-semibold tracking-wide text-gold"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <ImageSlot
          label="Photo of Jorge / the shop coming soon"
          className="h-[340px] w-full"
        />
      </div>

      <div className="rounded-[10px] border border-border bg-bg-deep p-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-gold">
          Mamba Mentality
        </h2>
        <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
          Inspired by Kobe Bryant&apos;s Black Mamba mindset — obsess over the
          details, outwork the problem, and never settle for “good enough.” That
          is how we approach every service interval, diagnostic, and brake job.
        </p>
      </div>
    </div>
  );
}
