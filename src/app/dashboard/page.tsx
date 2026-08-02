import type { Metadata } from "next";
import { OwnerDashboard } from "@/components/OwnerDashboard";

export const metadata: Metadata = {
  title: "Owner Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="min-h-[70vh] bg-[oklch(93%_0.006_260)] text-[oklch(20%_0.015_260)]">
      <OwnerDashboard />
    </div>
  );
}
