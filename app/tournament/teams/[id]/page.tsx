"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Trophy, Calendar, MapPin, ChevronLeft, Award, Activity, Users } from "lucide-react";
import { useTeam } from "@/services";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TeamAvatar from "@/components/tournament/TeamAvatar";

export default function TeamDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: team, isLoading } = useTeam(id as string);

  if (isLoading) return <LoadingSpinner />;

  if (!team) return <div className="text-center py-20 text-gray-400">Team not found.</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-500 hover:text-blue-400 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Teams
          </button>
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-4xl shadow-2xl">
              {team.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter">{team.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-400">
                <span className="flex items-center text-sm">
                  < Award className="w-4 h-4 mr-1.5 text-yellow-500" />
                  Premier Division
                </span>
                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                <span className="flex items-center text-sm">
                  <Activity className="w-4 h-4 mr-1.5 text-blue-500" />
                  Active Roster
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 px-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Win Rate</p>
          <p className="text-3xl font-black text-white">
            {team.matchResults.length > 0 
              ? Math.round((team.matchResults.filter((r: any) => r.result === 'WIN').length / team.matchResults.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Roster Section */}
        <div className="lg:col-span-1 space-y-8">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Users className="w-5 h-5 mr-3 text-blue-500" />
            Official Roster
          </h3>
          <div className="space-y-4">
            {team.players.map((player: any) => (
              <div
                key={player.id}
                className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <TeamAvatar name={player.name} size="md" />
                  <div>
                    <p className="text-sm font-bold text-white">{player.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{player.gender} • Level {player.level}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${player.gender === 'MALE' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'}`}>
                  {player.gender}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Match History Section */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
            Match History
          </h3>
          {team.matchResults.length === 0 ? (
            <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-12 text-center">
              <p className="text-gray-500">No matches played yet in this tournament.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {team.matchResults.map((result: any) => (
                <div
                  key={result.id}
                  className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${result.result === 'WIN' ? 'bg-green-500/10 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 text-red-500'}`}>
                        {result.result.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">
                          {result.match.timelineMatch.category.name} • {result.match.timelineMatch.round.name}
                        </p>
                        <p className="text-white font-bold group-hover:text-blue-400 transition-colors">
                          vs Opposition Team
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {result.match.setScores.map((set: any) => (
                        <div key={set.id} className="text-center bg-white/5 px-3 py-1 rounded-lg">
                          <p className="text-[10px] text-gray-500 font-bold mb-0.5">S{set.setNumber}</p>
                          <p className="text-sm font-black text-white">{set.scoreA}-{set.scoreB}</p>
                        </div>
                      ))}
                      <div className="ml-4 pl-4 border-l border-white/10">
                        <p className={`text-sm font-black ${result.result === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
                          {result.result === 'WIN' ? `+${result.points} pts` : `-${result.points} pts`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
