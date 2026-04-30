import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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

import Navbar from "@/components/bar/Navbar";
import Footer from "@/components/bar/Footer";
import QueryProvider from "@/components/providers/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}>
      <body>
        <QueryProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
            <Footer />
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
