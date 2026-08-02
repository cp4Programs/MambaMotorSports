import { PayInvoice } from "@/components/PayInvoice";
import { SectionHeading } from "@/components/ui";

export const metadata = {
  title: "Pay Invoice",
};

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="bg-[oklch(93%_0.004_260)] px-[6vw] py-16">
      <SectionHeading className="mb-3 text-panel-text">Pay Invoice</SectionHeading>
      {params.success ? (
        <p className="mb-6 rounded-[8px] border border-[oklch(80%_0.05_155)] bg-[oklch(96%_0.03_155)] px-4 py-3 text-sm text-[oklch(35%_0.1_155)]">
          Payment received. Stripe will email a receipt, and your invoice status
          will update shortly.
        </p>
      ) : null}
      {params.canceled ? (
        <p className="mb-6 rounded-[8px] border border-[oklch(80%_0.05_25)] bg-[oklch(96%_0.03_25)] px-4 py-3 text-sm text-[oklch(40%_0.15_25)]">
          Checkout canceled — your invoice is still unpaid. You can try again
          anytime.
        </p>
      ) : null}
      <PayInvoice />
    </div>
  );
}
