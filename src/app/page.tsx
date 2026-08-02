import Image from "next/image";
import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "@/components/ui";
import { SERVICES, TESTIMONIALS } from "@/lib/data";

export default function HomePage() {
  const homeServices = SERVICES.slice(0, 3);

  return (
    <div>
      <section className="relative flex flex-wrap items-center gap-14 overflow-hidden bg-[radial-gradient(ellipse_at_20%_10%,oklch(32%_0.15_305_/_0.35),transparent_55%),radial-gradient(ellipse_at_85%_90%,oklch(50%_0.19_25_/_0.22),transparent_50%),oklch(16%_0.015_255)] px-[6vw] py-[110px]">
        <div className="animate-fade-up min-w-[280px] flex-[1_1_480px]">
          <div className="mb-[18px] font-display text-[13px] font-semibold tracking-[0.3em] text-purple">
            BMW · AUDI · MERCEDES-BENZ SPECIALISTS
          </div>
          <h1 className="mb-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-[1.05] tracking-wide">
            <span className="text-gold">Mamba Mentality</span>,
            <br />
            Under the Hood.
          </h1>
          <p className="mb-9 max-w-[520px] text-lg leading-relaxed text-muted">
            Precision diagnostics, relentless attention to detail, and transparent
            pricing for the cars that demand it. We take your repair as seriously
            as you do.
          </p>
          <div className="flex flex-wrap gap-4">
            <PrimaryButton href="/book">Book a Service</PrimaryButton>
            <SecondaryButton href="/services">View Services</SecondaryButton>
          </div>
        </div>
        <div className="animate-fade-up-delay flex flex-[0_0_340px] justify-center">
          <Image
            src="/mambaMotorSportsLogo.jpg"
            alt="Mamba Motor Sports crest"
            width={340}
            height={340}
            className="animate-crest w-full max-w-[340px] rounded-2xl shadow-[0_30px_80px_-20px_oklch(0%_0_0_/_0.6),0_0_0_1px_var(--border)]"
            priority
          />
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 bg-bg px-[6vw] py-20">
        {[
          {
            n: "01",
            bg: "bg-purple-soft",
            title: "Specialized Expertise",
            body: "Every technician here works exclusively on BMW, Audi, and Mercedes-Benz — no jack-of-all-trades guessing.",
          },
          {
            n: "02",
            bg: "bg-orange",
            title: "Transparent Pricing",
            body: "Upfront price ranges on every service, with no surprise line items when you pick up your keys.",
          },
          {
            n: "03",
            bg: "bg-purple-deep",
            title: "Easy Online Booking",
            body: "Book, message, and pay online — no phone tag required to get your car back on the road.",
          },
        ].map((item) => (
          <div key={item.n}>
            <div
              className={`mb-[18px] flex h-11 w-11 items-center justify-center rounded-lg font-display text-base font-bold ${item.bg}`}
            >
              {item.n}
            </div>
            <h2 className="mb-2.5 font-display text-xl font-semibold">{item.title}</h2>
            <p className="text-[15px] leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-[radial-gradient(ellipse_at_15%_15%,oklch(38%_0.03_270_/_0.55),transparent_45%),radial-gradient(ellipse_at_85%_25%,oklch(32%_0.15_305_/_0.28),transparent_50%),radial-gradient(ellipse_at_60%_90%,oklch(28%_0.05_25_/_0.22),transparent_55%),oklch(21%_0.018_255)] px-[6vw] pb-[88px] pt-6">
        <div className="mb-9 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold">
            Our Services
          </h2>
          <Link href="/services" className="text-[15px] font-semibold text-purple">
            View all services →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {homeServices.map((svc) => (
            <div
              key={svc.name}
              className="rounded-[10px] border border-[oklch(40%_0.02_255)] bg-bg-elevated p-[26px] backdrop-blur-[2px]"
            >
              <h3 className="mb-2.5 font-display text-lg font-semibold">{svc.name}</h3>
              <p className="mb-3.5 text-sm leading-relaxed text-muted">{svc.blurb}</p>
              <div className="text-[15px] font-bold text-gold">{svc.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg-deep px-[6vw] py-20">
        <h2 className="mb-10 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold">
          What Owners Say
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-[10px] border border-border bg-bg p-6"
            >
              <p className="mb-5 text-[15px] leading-relaxed text-muted">
                “{t.quote}”
              </p>
              <footer className="font-semibold">
                {t.name}{" "}
                <span className="font-normal text-muted">· {t.car}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-[radial-gradient(ellipse_at_50%_0%,oklch(32%_0.15_305_/_0.3),transparent_60%),oklch(16%_0.015_255)] px-[6vw] py-20 text-center">
        <h2 className="mb-4 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold">
          Ready when you are.
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-muted">
          Book online in minutes — we&apos;ll confirm your appointment and keep
          you updated every step of the way.
        </p>
        <PrimaryButton href="/book">Book a Service</PrimaryButton>
      </section>
    </div>
  );
}
