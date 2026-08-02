import { Suspense } from "react";
import { BookingForm } from "@/components/BookingForm";
import { SectionHeading } from "@/components/ui";

export const metadata = {
  title: "Book a Service",
};

export default function BookPage() {
  return (
    <div className="bg-[oklch(93%_0.004_260)] px-[6vw] py-16">
      <SectionHeading className="mb-3 text-panel-text">Book a Service</SectionHeading>
      <p className="mb-10 max-w-2xl text-panel-muted">
        Tell us about your car and preferred time. We&apos;ll confirm your
        appointment by email.
      </p>
      <Suspense fallback={<div className="text-panel-muted">Loading form…</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
