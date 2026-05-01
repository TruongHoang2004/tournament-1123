"use client";

import { FeaturesGrid } from "./FeaturesGrid";
import { AboutSection } from "./AboutSection";
import { JoinSection } from "./JoinSection";

export default function InfoSection() {
  return (
    <main className="w-full flex flex-col items-center justify-center relative z-10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 relative z-20 space-y-24 md:space-y-32 flex flex-col items-center">
        <FeaturesGrid />
        <AboutSection />
        <JoinSection />
      </div>
    </main>
  );
}
