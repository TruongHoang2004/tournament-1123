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

          {/* Thành viên bộ đôi */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">
              Thành viên bộ đôi
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href={`/players/${double.player1.id}`} className="block glass p-4 hover:border-primary/40 transition-all text-center space-y-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center text-sm font-black text-zinc-500 mx-auto">
                  {double.player1.name.substring(0, 1)}
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-800 group-hover:text-primary transition-colors truncate">{double.player1.name}</p>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">VĐV 1</p>
                </div>
              </Link>

              <Link href={`/players/${double.player2.id}`} className="block glass p-4 hover:border-primary/40 transition-all text-center space-y-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center text-sm font-black text-zinc-500 mx-auto">
                  {double.player2.name.substring(0, 1)}
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-800 group-hover:text-primary transition-colors truncate">{double.player2.name}</p>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">VĐV 2</p>
                </div>
              </Link>
            </div>
          </div>

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
