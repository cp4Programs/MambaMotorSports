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
  icons: {
    icon: "/mambaMotorSportsLogo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${inter.variable} antialiased`}>
        <div className="min-h-screen overflow-x-hidden bg-bg text-fg">
          <Nav />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
