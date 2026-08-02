import type { Metadata } from "next";
import { PayInvoice } from "@/components/PayInvoice";

export const metadata: Metadata = {
  title: "Pay Invoice",
};

export default function PayPage() {
  return (
    <div className="min-h-[70vh] bg-[oklch(97%_0.004_260)] px-[6vw] py-[72px] text-[oklch(20%_0.015_260)]">
      <div className="mx-auto max-w-[560px]">
        <h1 className="font-display mb-2.5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold">
          Pay Invoice
        </h1>
        <p className="mb-9 text-[15px] text-[oklch(40%_0.015_260)]">
          Enter your invoice number to view and pay your balance securely. Try{" "}
          <strong>MMS-1042</strong> or <strong>MMS-1077</strong>.
        </p>
        <PayInvoice />
      </div>
    </div>
  );
}
