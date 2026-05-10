"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Users,
  ChevronLeft,
  Loader2,
  TrendingUp,
  UserSquare2,
  Compass,
  Swords
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import UserMatchCard from "@/components/tournament/UserMatchCard";

interface Player {
  id: string;
  name: string;
  gender: string;
  level: number;
}

interface Double {
  id: string;
  player1: Player;
  player2: Player;
  category: { name: string };
  group: string | null;
}

interface TeamResultLog {
  id: string;
  result: "WIN" | "LOSS";
  points: number;
  match: {
    id: string;
    winnerTeamId: string | null;
    playedAt: string | null;
    doubleA: any;
    doubleB: any;
    setScores: any[];
    timelineMatch: {
      order: number;
      round: { name: string };
      category: { name: string };
    };
  };
}

interface TeamDetail {
  id: string;
  name: string;
  players: Player[];
  doubles: Double[];
  matchResults: TeamResultLog[];
}

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/teams/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setTeam(data);
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

  if (!team) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-500 font-bold">Không tìm thấy đội tuyển</p>
        <Link href="/teams" className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const totalPoints = team.matchResults.reduce((sum, log) => sum + log.points, 0);
  const winsCount = team.matchResults.filter((log) => log.result === "WIN").length;
  const lossesCount = team.matchResults.filter((log) => log.result === "LOSS").length;

  return (
    <div className="min-h-screen pb-24">
      {/* Upper Navigation bar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-4">
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Quay lại danh sách Đội
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">
        {/* Header section with unified style */}
        <SectionHeader
          title={team.name}
          subtitle={`Chi tiết đội hình và kết quả thi đấu của ${team.name}`}
          badge="Hồ sơ câu lạc bộ"
        />

        {/* Stats and Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Performance Stats Card */}
          <div className="lg:col-span-1 glass p-6 space-y-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary to-orange-400" />

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" /> Thành tích giải đấu
              </h3>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Tổng điểm đạt được</span>
                <p className="text-5xl font-black text-primary italic leading-none">{totalPoints}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-4 border-t border-zinc-100">
              <div className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100">
                <span className="text-[9px] font-bold text-emerald-600 block uppercase">Thắng</span>
                <span className="text-lg font-black text-emerald-700">{winsCount}</span>
              </div>
              <div className="bg-red-50/50 rounded-xl p-2.5 border border-red-100">
                <span className="text-[9px] font-bold text-red-500 block uppercase">Thua</span>
                <span className="text-lg font-black text-red-600">{lossesCount}</span>
              </div>
            </div>
          </div>

          {/* Roster Players Card */}
          <div className="lg:col-span-3 glass p-6 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <UserSquare2 className="w-4 h-4 text-primary" /> Thành viên đội bóng ({team.players.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.players.map((p, i) => (
                <Link
                  href={`/players/${p.id}`}
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-zinc-100 hover:border-primary/20 hover:shadow-sm hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center text-xs font-black text-slate-500 transition-colors">
                      {i + 1}
                    </span>
                    <span className="text-sm font-black text-zinc-800 truncate">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-lg">
                    Lvl {p.level}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Doubles and Matches sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doubles list */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-primary rounded-full shadow-[0_0_12px_rgba(232,118,45,0.4)]"></div>
              <h3 className="text-xl font-black italic tracking-tight text-zinc-900 uppercase">
                Cặp đấu đại diện
              </h3>
            </div>

            <div className="space-y-4">
              {team.doubles.length === 0 ? (
                <div className="glass p-6 text-center text-xs text-zinc-400 italic">
                  Chưa phân cặp đấu
                </div>
              ) : (
                team.doubles.map((d) => (
                  <div key={d.id} className="glass p-5 border border-zinc-150 space-y-3 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-lg">
                        {d.category.name}
                      </span>
                      {d.group && (
                        <span className="text-[9px] font-black uppercase bg-zinc-100 text-zinc-500 px-2.5 py-0.5 rounded-lg">
                          Bảng {d.group}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-black text-zinc-800">
                      {d.player1.name} & {d.player2.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Match logs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-primary rounded-full shadow-[0_0_12px_rgba(232,118,45,0.4)]"></div>
              <h3 className="text-xl font-black italic tracking-tight text-zinc-900 uppercase">
                Lịch sử & lịch đấu ({team.matchResults.length})
              </h3>
            </div>

            <div className="space-y-4">
              {team.matchResults.length === 0 ? (
                <div className="glass p-8 text-center text-xs text-zinc-400 italic">
                  Chưa xếp lịch hoặc chưa tham gia trận đấu nào
                </div>
              ) : (
                team.matchResults.map((log) => (
                  <UserMatchCard
                    key={log.id}
                    order={log.match.timelineMatch.order}
                    roundName={log.match.timelineMatch.round.name}
                    categoryName={log.match.timelineMatch.category.name}
                    match={log.match}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
