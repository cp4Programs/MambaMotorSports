import { Dashboard } from "@/components/Dashboard";
import { SectionHeading } from "@/components/ui";

export const metadata = {
  title: "Owner Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="bg-[oklch(93%_0.004_260)] px-[6vw] py-16">
      <SectionHeading className="mb-8 text-panel-text">Dashboard</SectionHeading>
      <Dashboard />
    </div>
  );
}
