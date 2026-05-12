"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import DoubleDetailCard, { Double } from "@/components/doubles/DoubleDetailCard";
import DoublePerformanceCard from "@/components/doubles/DoublePerformanceCard";
import DoubleMatchHistory, { Match } from "@/components/doubles/DoubleMatchHistory";

export default function DoubleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [double, setDouble] = useState<Double | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/doubles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setDouble(data.double);
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

  if (!double) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-500 font-bold">Không tìm thấy cặp đôi</p>
        <Link href="/doubles" className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider">
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
    return m.winnerTeamId === double.teamId;
  }).length;

  const winRate = totalMatchesCount > 0 ? Math.round((winsCount / totalMatchesCount) * 100) : 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Upper navigation header */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-4">
        <Link
          href="/doubles"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Danh sách cặp đôi
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <DoubleDetailCard double={double} />

          <DoublePerformanceCard
            totalMatchesCount={totalMatchesCount}
            winsCount={winsCount}
            winRate={winRate}
          />
        </div>

        {/* Matches timeline tabs / lists */}
        <div className="lg:col-span-2 space-y-6">
          <DoubleMatchHistory
            liveMatches={liveMatches}
            upcomingMatches={upcomingMatches}
            playedMatches={playedMatches}
          />
        </div>
      </div>
    </div>
  );
}
