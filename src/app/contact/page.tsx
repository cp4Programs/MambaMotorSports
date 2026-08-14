import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { loadPublishedSite } from "@/server/published-site";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const { copy } = await loadPublishedSite();
  return (
    <div className="min-h-[70vh] bg-[oklch(93%_0.006_260)] px-[6vw] py-[72px] text-[oklch(20%_0.015_260)]">
      <div className="mx-auto max-w-[640px]">
        <h1 className="font-display mb-2.5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold">
          Contact Us
        </h1>
        <p className="mb-2 text-[15px] text-[oklch(40%_0.015_260)]">{copy.contactIntro}</p>
        <p className="mb-3 text-sm font-semibold text-[oklch(42%_0.16_305)]">
          {copy.contactResponseNote}
        </p>
        {copy.phone || copy.email || copy.address ? (
          <p className="mb-9 text-sm text-[oklch(40%_0.015_260)]">
            {[copy.phone, copy.email, copy.address].filter(Boolean).join(" · ")}
          </p>
        ) : (
          <div className="mb-9" />
        )}
        <ContactForm />
      </div>
    </div>
  );
}
