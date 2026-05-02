import type { Metadata } from "next";
import { Geist_Mono, Inter, Outfit, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

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

import Navbar from "@/components/bar/Navbar";
import Footer from "@/components/bar/Footer";
import QueryProvider from "@/components/providers/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${beVietnamPro.variable} ${geistMono.variable} ${outfit.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <Navbar />
          <main
            className="relative flex-1 flex flex-col w-full"
            style={{ paddingTop: '5rem' }} // pt-28 equivalent (112px)
          >
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
