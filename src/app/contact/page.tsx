import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="min-h-[70vh] bg-[oklch(93%_0.006_260)] px-[6vw] py-[72px] text-[oklch(20%_0.015_260)]">
      <div className="mx-auto max-w-[640px]">
        <h1 className="font-display mb-2.5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold">
          Contact Us
        </h1>
        <p className="mb-2 text-[15px] text-[oklch(40%_0.015_260)]">
          Questions, quotes, or just want to talk shop — send us a message.
        </p>
        <p className="mb-9 text-sm font-semibold text-[oklch(42%_0.16_305)]">
          We typically respond within 4 business hours.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
