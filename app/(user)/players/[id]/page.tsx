"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import PlayerDetailCard, { Player } from "@/components/players/PlayerDetailCard";
import PlayerPerformanceCard from "@/components/players/PlayerPerformanceCard";
import PlayerMatchHistory, { Match } from "@/components/players/PlayerMatchHistory";

export default function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/players/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setPlayer(data.player);
        setMatches(data.matches || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-500 font-bold">Không tìm thấy vận động viên</p>
        <Link href="/players" className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Phân loại trận đấu
  const playedMatches = matches.filter((m) => !!m.winnerTeamId);
  const liveMatches = matches.filter((m) => !m.winnerTeamId && !!m.playedAt);
  const upcomingMatches = matches.filter((m) => !m.winnerTeamId && !m.playedAt);

  // Tính thống kê (Chỉ tính các trận đã có kết quả/đã hoàn thành)
  const totalMatchesCount = playedMatches.length;
  const winsCount = playedMatches.filter((m) => {
    const isDoubleA = m.doubleA.player1.name === player.name || m.doubleA.player2.name === player.name;
    const isDoubleB = m.doubleB.player1.name === player.name || m.doubleB.player2.name === player.name;

    const winnerIdMatchesDoubleA = m.winnerTeamId === m.doubleA.id;
    const winnerIdMatchesDoubleB = m.winnerTeamId === m.doubleB.id;
    return (isDoubleA && winnerIdMatchesDoubleA) || (isDoubleB && winnerIdMatchesDoubleB);
  }).length;

  const winRate = totalMatchesCount > 0 ? Math.round((winsCount / totalMatchesCount) * 100) : 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Upper navigation header */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-4">
        <Link
          href="/players"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Danh sách VĐV
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <PlayerDetailCard player={player} />

          <PlayerPerformanceCard
            totalMatchesCount={totalMatchesCount}
            winsCount={winsCount}
            winRate={winRate}
          />
        </div>

        {/* Matches timeline tabs / lists */}
        <div className="lg:col-span-2 space-y-6">
          <PlayerMatchHistory
            liveMatches={liveMatches}
            upcomingMatches={upcomingMatches}
            playedMatches={playedMatches}
          />
        </div>
      </div>
    </div>
  );
}
