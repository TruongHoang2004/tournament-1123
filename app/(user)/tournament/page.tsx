"use client";

import { Trophy, TrendingUp, Users, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import SectionHeader from "@/components/shared/SectionHeader";
import LeaderboardTable from "@/components/tournament/LeaderboardTable";

export default function TournamentPage() {


  return (
    <div className="space-y-12">
      {/* Hero Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Top Leader"
          value={topTeams[0]?.name || "N/A"}
          icon={Trophy}
          iconColor="text-yellow-500"
          trend={`${topTeams[0]?.totalPoints || 0} Total Points`}
          trendIcon={TrendingUp}
        />
        <StatCard
          label="Total Teams"
          value={data.leaderboard.length}
          icon={Users}
          iconColor="text-blue-500"
          trend="All Teams Verified"
          trendIcon={ShieldCheck}
        />
        <StatCard
          label="Tournament Date"
          value={new Date(data.tournament.date).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          icon={Calendar}
          iconColor="text-purple-500"
          trend="Tournament Ongoing"
          trendIcon={ArrowRight}
        />
      </div> */}

      {/* Leaderboard Table */}
      {/* <section>
        <SectionHeader
          title="Official Standings"
          badge="Live Updates"
          className="mb-8"
        />
        <LeaderboardTable teams={data.leaderboard} />
      </section> */}
    </div>
  );
}
