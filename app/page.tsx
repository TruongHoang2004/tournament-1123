"use client";

import { useEffect, useState } from "react";
import { TournamentState } from "@/lib/types";
import { initialData } from "@/lib/data";
import Hero from "@/components/Hero";
import StatsOverview from "@/components/StatsOverview";
import InfoSection from "@/components/InfoSection";
import Standings from "@/components/Standings";
import MatchTimeline from "@/components/MatchTimeline";

export default function Home() {
  const [data, setData] = useState<TournamentState>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/tournament');
        if (res.ok) {
          const newData = await res.json();
          setData(newData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const { teams, matches } = data;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Hero />

      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        <div className="flex flex-col items-center space-y-20">

          <StatsOverview teams={teams} />

          <div className="flex justify-center">
            <div className="space-y-20 w-full">
              <InfoSection />

              <div className="space-y-20">
                <Standings teams={teams} />
                <MatchTimeline matches={matches} teams={teams} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
