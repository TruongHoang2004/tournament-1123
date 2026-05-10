"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Calendar,
  TrendingUp,
  ChevronLeft,
  Loader2,
  CheckCircle2
} from "lucide-react";
import UserMatchCard from "@/components/tournament/UserMatchCard";

interface Player {
  id: string;
  name: string;
  gender: string;
  level: number;
  team: {
    name: string;
  } | null;
}

interface Match {
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

  // Tính thống kê
  const totalMatchesCount = matches.length;
  const winsCount = matches.filter((m) => {
    const isDoubleA = m.doubleA.player1.name === player.name || m.doubleA.player2.name === player.name;
    const isWinnerA = m.winnerTeamId === m.doubleA.id || m.winnerTeamId === m.doubleA.teamId;
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
          <div className="glass p-6 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-primary to-orange-400" />

            {/* Avatar / Initial badge */}
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-3xl font-black text-primary italic shadow-sm shadow-primary/5">
              {player.name.substring(0, 1)}
            </div>

            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-zinc-900">{player.name}</h2>
              <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
                {player.team?.name || "VĐV Tự do"}
              </p>
            </div>

            {/* Profile specifications */}
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 text-left">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Giới tính</span>
                <span className="text-sm font-bold text-zinc-800">{player.gender === "MALE" ? "Nam" : "Nữ"}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Trình độ</span>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-black">
                  {player.level}
                </span>
              </div>
            </div>
          </div>

          {/* Stats overview card */}
          <div className="glass p-6 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" /> Hiệu suất thi đấu
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">Trận</span>
                <span className="text-xl font-black text-zinc-800">{totalMatchesCount}</span>
              </div>
              <div className="bg-emerald-50/40 rounded-2xl p-3 border border-emerald-100/50">
                <span className="text-[10px] font-bold text-emerald-600 block uppercase">Thắng</span>
                <span className="text-xl font-black text-emerald-700">{winsCount}</span>
              </div>
              <div className="bg-red-50/40 rounded-2xl p-3 border border-red-100/50">
                <span className="text-[10px] font-bold text-red-500 block uppercase">Thua</span>
                <span className="text-xl font-black text-red-600">{totalMatchesCount - winsCount}</span>
              </div>
            </div>

            {/* Winrate circle */}
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-zinc-800 uppercase tracking-wide">Tỉ lệ thắng</span>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Dựa trên tất cả các set đấu đã hoàn thành</p>
              </div>
              <div className="text-2xl font-black italic text-primary">
                {winRate}%
              </div>
            </div>
          </div>
        </div>

        {/* Matches timeline tabs / lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_12px_rgba(232,118,45,0.4)]"></div>
            <h3 className="text-2xl font-black italic tracking-tight text-zinc-900 uppercase">
              Hành trình thi đấu
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
                Không có trận đấu sắp tới nào được lên lịch
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
                Chưa hoàn thành trận đấu nào
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
      </div>
    </div>
  );
}
