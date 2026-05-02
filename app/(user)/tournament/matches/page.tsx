"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SectionHeader from "@/components/shared/SectionHeader";
import MatchCard from "@/components/tournament/MatchCard";
import {useMatches, useUpdateScore, useFinalizeMatch } from "@/services";

export default function MatchesPage() {

  const { data: matches = [], isLoading: isLoadingMatches } = useMatches();

  const updateScoreMutation = useUpdateScore();
  const finalizeMutation = useFinalizeMatch();

  const handleUpdateScore = async (matchId: string, setNumber: number, scoreA: number, scoreB: number) => {
    updateScoreMutation.mutate({ matchId, setNumber, scoreA, scoreB });
  };

  const handleFinalize = async (matchId: string) => {
    if (!confirm("Are you sure you want to finalize this match? Points will be awarded and result will be permanent.")) return;
    finalizeMutation.mutate(matchId);
  };

  const isLoading = isLoadingMatches;
  const updating = updateScoreMutation.isPending || finalizeMutation.isPending;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-12">
      <SectionHeader 
        title="Match Management" 
        subtitle="Update scores and finalize tournament results" 
      />

      <div className="grid grid-cols-1 gap-6">
        {matches.map((match: any) => (
          <MatchCard
            key={match.id}
            match={match}
            updating={updating}
            onUpdateScore={handleUpdateScore}
            onFinalize={handleFinalize}
          />
        ))}
      </div>
    </div>
  );
}
