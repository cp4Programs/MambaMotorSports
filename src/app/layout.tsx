import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Mamba Motor Sports | BMW · Audi · Mercedes Specialists",
    template: "%s | Mamba Motor Sports",
  },
  description:
    "Precision diagnostics and transparent pricing for BMW, Audi, and Mercedes-Benz in Los Angeles & Orange County.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${inter.variable} antialiased`}>
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-[oklch(21%_0.018_255)] text-[oklch(97%_0.004_260)]">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
