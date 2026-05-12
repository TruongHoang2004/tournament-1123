import React from "react";
import { Calendar, CheckCircle2 } from "lucide-react";
import UserMatchCard from "@/components/tournament/UserMatchCard";

export interface Match {
  id: string;
  winnerTeamId: string | null;
  playedAt: string | null;
  doubleA: {
    id: string;
    teamId: string;
    team: { name: string };
    player1: { name: string };
    player2: { name: string };
  };
  doubleB: {
    id: string;
    teamId: string;
    team: { name: string };
    player1: { name: string };
    player2: { name: string };
  };
  setScores: Array<{
    id: string;
    scoreA: number;
    scoreB: number;
  }>;
  timelineMatch: {
    order: number;
    round: { name: string };
    category: { name: string };
  };
}

interface DoubleMatchHistoryProps {
  liveMatches: Match[];
  upcomingMatches: Match[];
  playedMatches: Match[];
}

export default function DoubleMatchHistory({
  liveMatches,
  upcomingMatches,
  playedMatches
}: DoubleMatchHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_12px_rgba(232,118,45,0.4)]"></div>
        <h3 className="text-2xl font-black italic tracking-tight text-zinc-900 uppercase">
          Lịch trình thi đấu cặp đôi
        </h3>
      </div>

      {/* 1. Live Matches */}
      {liveMatches.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Trận đấu đang diễn ra
          </h4>
          <div className="space-y-4">
            {liveMatches.map((m) => (
              <UserMatchCard
                key={m.id}
                order={m.timelineMatch.order}
                roundName={m.timelineMatch.round.name}
                categoryName={m.timelineMatch.category.name}
                match={m}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Upcoming Matches */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-blue-500" /> Các trận chuẩn bị diễn ra ({upcomingMatches.length})
        </h4>
        {upcomingMatches.length === 0 ? (
          <div className="glass p-8 text-center text-xs text-zinc-400 italic">
            Không có trận đấu sắp tới nào được lên lịch cho cặp đôi này
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingMatches.map((m) => (
              <UserMatchCard
                key={m.id}
                order={m.timelineMatch.order}
                roundName={m.timelineMatch.round.name}
                categoryName={m.timelineMatch.category.name}
                match={m}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Played Matches */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lịch sử trận đấu đã hoàn thành ({playedMatches.length})
        </h4>
        {playedMatches.length === 0 ? (
          <div className="glass p-8 text-center text-xs text-zinc-400 italic">
            Cặp đôi này chưa hoàn thành trận đấu nào
          </div>
        ) : (
          <div className="space-y-4">
            {playedMatches.map((m) => (
              <UserMatchCard
                key={m.id}
                order={m.timelineMatch.order}
                roundName={m.timelineMatch.round.name}
                categoryName={m.timelineMatch.category.name}
                match={m}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
