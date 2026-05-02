import type { Metadata } from "next";
import { Geist_Mono, Inter, Outfit, Be_Vietnam_Pro, Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  weight: "400",
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: "400",
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1123 Badminton Tournament | Real-time Scores",
  description: "Live score tracking and leaderboard for the 1123 Badminton Tournament.",
};

import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${beVietnamPro.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground relative isolate">
        <QueryProvider>
          {children}
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
