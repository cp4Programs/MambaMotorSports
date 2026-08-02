import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/ui";
import { REGION } from "@/lib/data";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="bg-[oklch(93%_0.004_260)] px-[6vw] py-16">
      <SectionHeading className="mb-3 text-panel-text">Contact</SectionHeading>
      <p className="mb-10 max-w-2xl text-panel-muted">
        Questions about a quote, status update, or something under the hood?
        Reach out — serving {REGION}.
      </p>
      <ContactForm />
    </div>
  );
}
