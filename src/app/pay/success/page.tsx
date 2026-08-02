import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Received",
};

export default async function PaySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;

  return (
    <div className="min-h-[70vh] bg-[oklch(97%_0.004_260)] px-[6vw] py-[72px] text-[oklch(20%_0.015_260)]">
      <div className="mx-auto max-w-[560px] rounded-lg border border-[oklch(85%_0.006_260)] border-l-4 border-l-[oklch(42%_0.16_305)] bg-[oklch(93%_0.006_260)] p-8">
        <h1 className="font-display mb-3 text-[22px] font-bold">Payment received.</h1>
        <p className="mb-2 leading-relaxed">
          {invoice
            ? `Invoice ${invoice} is paid in full. A receipt has been emailed to you.`
            : "Your payment went through. A receipt has been emailed to you."}
        </p>
        {invoice ? (
          <p className="mb-6 text-[13px] text-[oklch(40%_0.015_260)]">
            Confirmation #MAMBA-{invoice}-OK
          </p>
        ) : null}
        <Link
          href="/pay"
          className="inline-block rounded bg-[oklch(20%_0.015_260)] px-[22px] py-3 text-sm font-bold text-[oklch(97%_0.004_260)] hover:text-[oklch(97%_0.004_260)]"
        >
          Look Up Another Invoice
        </Link>
      </div>
    </div>
  );
}
