"use client";

import {  useTeams } from "@/services";

interface Team {
  id: string;
  name: string;
  players: { id: string; name: string; gender: string; level: number }[];
  doubles: any[];
}

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SectionHeader from "@/components/shared/SectionHeader";
import TeamCard from "@/components/tournament/TeamCard";

export default function TeamsPage() {

  const { data: teams = [], isLoading } = useTeams();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-12">
      <SectionHeader 
        title="Tournament Teams" 
        subtitle={`Managing ${teams.length} participating rosters`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team: any) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
