import Image from "next/image";
import Link from "next/link";
import { SERVICES, TESTIMONIALS } from "@/lib/content";

const pillars = [
  {
    n: "01",
    title: "Specialized Expertise",
    body: "Every technician here works exclusively on BMW, Audi, and Mercedes-Benz — no jack-of-all-trades guessing.",
    bg: "oklch(32% 0.15 305)",
  },
  {
    n: "02",
    title: "Transparent Pricing",
    body: "Upfront price ranges on every service, with no surprise line items when you pick up your keys.",
    bg: "oklch(50% 0.19 25)",
  },
  {
    n: "03",
    title: "Easy Online Booking",
    body: "Book, message, and pay online — no phone tag required to get your car back on the road.",
    bg: "oklch(42% 0.16 305)",
  },
];

export default function HomePage() {
  const homeServices = SERVICES.slice(0, 3);

  return (
    <div>
      <section className="relative flex flex-wrap items-center gap-14 overflow-hidden bg-[radial-gradient(ellipse_at_20%_10%,oklch(32%_0.15_305_/_0.35),transparent_55%),radial-gradient(ellipse_at_85%_90%,oklch(50%_0.19_25_/_0.22),transparent_50%),oklch(16%_0.015_255)] px-[6vw] py-[110px]">
        <div className="min-w-[280px] flex-1 basis-[480px]">
          <p className="font-display mb-[18px] text-[13px] font-semibold tracking-[0.3em] text-[oklch(64%_0.14_305)]">
            BMW · AUDI · MERCEDES-BENZ SPECIALISTS
          </p>
          <h1 className="font-display mb-6 text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-[1.05] tracking-[0.01em]">
            <span className="text-[oklch(78%_0.1_85)]">Mamba Mentality</span>,
            <br />
            Under the Hood.
          </h1>
          <p className="mb-9 max-w-[520px] text-lg leading-relaxed text-[oklch(78%_0.012_260)]">
            Precision diagnostics, relentless attention to detail, and transparent
            pricing for the cars that demand it. We take your repair as seriously as
            you do.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/book"
              className="rounded bg-[oklch(50%_0.19_25)] px-8 py-4 text-base font-bold text-[oklch(97%_0.004_260)] hover:bg-[oklch(43%_0.19_25)] hover:text-[oklch(97%_0.004_260)]"
            >
              Book a Service
            </Link>
            <Link
              href="/services"
              className="rounded border border-[oklch(34%_0.02_255)] bg-transparent px-8 py-4 text-base font-semibold text-[oklch(97%_0.004_260)] hover:border-[oklch(64%_0.14_305)] hover:text-[oklch(97%_0.004_260)]"
            >
              View Services
            </Link>
          </div>
        </div>
        <div className="flex basis-[340px] justify-center">
          <Image
            src="/mambaMotorSportsLogo.jpg"
            alt="Mamba Motor Sports crest"
            width={340}
            height={340}
            className="w-full max-w-[340px] rounded-2xl shadow-[0_30px_80px_-20px_oklch(0%_0_0_/_0.6),0_0_0_1px_oklch(34%_0.02_255)]"
            priority
          />
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 bg-[oklch(21%_0.018_255)] px-[6vw] py-20">
        {pillars.map((p) => (
          <div key={p.n}>
            <div
              className="font-display mb-[18px] flex h-11 w-11 items-center justify-center rounded-lg text-base font-bold"
              style={{ background: p.bg }}
            >
              {p.n}
            </div>
            <h2 className="font-display mb-2.5 text-xl font-semibold">{p.title}</h2>
            <p className="text-[15px] leading-relaxed text-[oklch(78%_0.012_260)]">{p.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-[radial-gradient(ellipse_at_15%_15%,oklch(38%_0.03_270_/_0.55),transparent_45%),radial-gradient(ellipse_at_85%_25%,oklch(32%_0.15_305_/_0.28),transparent_50%),radial-gradient(ellipse_at_60%_90%,oklch(28%_0.05_25_/_0.22),transparent_55%),oklch(21%_0.018_255)] px-[6vw] pb-[88px] pt-6">
        <div className="mb-9 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold">
            Our Services
          </h2>
          <Link
            href="/services"
            className="text-[15px] font-semibold text-[oklch(64%_0.14_305)]"
          >
            View all services →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {homeServices.map((svc) => (
            <div
              key={svc.name}
              className="rounded-[10px] border border-[oklch(40%_0.02_255)] bg-[oklch(27%_0.02_255_/_0.85)] p-[26px] backdrop-blur-[2px]"
            >
              <h3 className="font-display mb-2.5 text-lg font-semibold">{svc.name}</h3>
              <p className="mb-3.5 text-sm leading-relaxed text-[oklch(78%_0.012_260)]">
                {svc.blurb}
              </p>
              <div className="text-[15px] font-bold text-[oklch(78%_0.1_85)]">{svc.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[oklch(16%_0.015_255)] px-[6vw] py-[88px]">
        <h2 className="font-display mb-10 text-center text-[clamp(1.6rem,3vw,2.2rem)] font-bold">
          What Owners Say
        </h2>
        <div className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-[10px] border border-[oklch(34%_0.02_255)] bg-[oklch(27%_0.02_255)] p-7"
            >
              <div className="mb-3.5 text-[13px] tracking-[0.15em] text-[oklch(78%_0.1_85)]">
                ★★★★★
              </div>
              <p className="mb-[18px] text-[15px] leading-relaxed">“{t.quote}”</p>
              <div className="text-[13px] font-semibold text-[oklch(78%_0.012_260)]">
                {t.name} · {t.car}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-6 bg-[linear-gradient(120deg,oklch(32%_0.15_305),oklch(21%_0.018_255)_70%)] px-[6vw] py-16">
        <h2 className="font-display max-w-[560px] text-[clamp(1.4rem,2.6vw,2rem)] font-bold">
          Ready to experience the Mamba difference?
        </h2>
        <Link
          href="/book"
          className="whitespace-nowrap rounded bg-[oklch(50%_0.19_25)] px-[34px] py-4 text-base font-bold text-[oklch(97%_0.004_260)] hover:bg-[oklch(43%_0.19_25)] hover:text-[oklch(97%_0.004_260)]"
        >
          Book a Service
        </Link>
      </section>
    </div>
  );
}
