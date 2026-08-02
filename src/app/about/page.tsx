import type { Metadata } from "next";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-[radial-gradient(ellipse_at_30%_20%,oklch(32%_0.15_305_/_0.35),transparent_55%),radial-gradient(ellipse_at_90%_80%,oklch(50%_0.19_25_/_0.2),transparent_50%),oklch(16%_0.015_255)] px-[6vw] py-24 text-center">
        <Image
          src="/mambaMotorSportsLogo.jpg"
          alt="Mamba Motor Sports crest"
          width={140}
          height={140}
          className="mx-auto mb-7 rounded-full object-cover shadow-[0_0_0_3px_oklch(42%_0.16_305)]"
        />
        <h1 className="font-display mb-4 text-[clamp(2rem,4vw,3rem)] font-bold">
          The <span className="text-[oklch(78%_0.1_85)]">Mamba Mentality</span>, Under
          the Hood
        </h1>
        <p className="mx-auto max-w-[620px] text-base leading-[1.7] text-[oklch(78%_0.012_260)]">
          Named in tribute to Kobe Bryant&apos;s Black Mamba persona — the same
          relentless focus, discipline, and refusal to cut corners, applied to every
          BMW, Audi, and Mercedes-Benz that comes through our bay.
        </p>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-12 bg-[oklch(21%_0.018_255)] px-[6vw] py-20">
        <div>
          <h2 className="font-display mb-4 text-2xl font-semibold">Meet Jorge Acosta</h2>
          <p className="mb-3.5 text-[15px] leading-[1.7] text-[oklch(78%_0.012_260)]">
            Jorge founded Mamba Motor Sports to bring dealer-level precision to
            independent repair — serving Los Angeles and Orange County owners who
            expect their BMW, Audi, or Mercedes to be handled by someone who
            actually knows the platform.
          </p>
          <p className="mb-6 text-[15px] leading-[1.7] text-[oklch(78%_0.012_260)]">
            Every job in the shop is measured against the same standard: precision,
            discipline, and relentless attention to detail — the{" "}
            <span className="font-semibold text-[oklch(78%_0.1_85)]">Mamba Mentality</span>.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {["ASE Certified", "German Import Specialist", "Los Angeles & Orange County"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[oklch(34%_0.02_255)] bg-[oklch(27%_0.02_255)] px-3.5 py-2 text-[13px] font-semibold"
                >
                  {badge}
                </span>
              ),
            )}
          </div>
        </div>
        <ImagePlaceholder
          label="Photo of Jorge / the shop coming soon"
          className="h-[340px] w-full"
        />
      </section>

      <section className="bg-[oklch(21%_0.018_255)] px-[6vw] pb-24">
        <h2 className="font-display mb-5 text-xl font-semibold">Around the Shop</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          <ImagePlaceholder label="Shop / garage photo" className="h-[220px] w-full" />
          <ImagePlaceholder label="Shop / garage photo" className="h-[220px] w-full" />
        </div>
      </section>
    </div>
  );
}
