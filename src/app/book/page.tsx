import type { Metadata } from "next";
import { Suspense } from "react";
import { BookForm } from "@/components/BookForm";

export const metadata: Metadata = {
  title: "Book an Appointment",
};

export default function BookPage() {
  return (
    <div className="min-h-[70vh] bg-[oklch(93%_0.006_260)] px-[6vw] py-[72px] text-[oklch(20%_0.015_260)]">
      <div className="mx-auto max-w-[640px]">
        <h1 className="font-display mb-2.5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold">
          Book an Appointment
        </h1>
        <p className="mb-9 text-[15px] text-[oklch(40%_0.015_260)]">
          Tell us about your vehicle and what&apos;s going on — we&apos;ll confirm a
          time shortly.
        </p>
        <Suspense fallback={<p>Loading form…</p>}>
          <BookForm />
        </Suspense>
      </div>
    </div>
  );
}
