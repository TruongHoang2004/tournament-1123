"use client";

import { useEffect, useState } from "react";
import { TournamentState, Match, Category } from "@/lib/types";
import { initialData } from "@/lib/data";

export default function AdminPage() {
  const [data, setData] = useState<TournamentState>(initialData);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tournament')
      .then(res => res.json())
      .then(setData);
  }, []);

  const updateServer = async (newData: TournamentState) => {
    setData(newData);
    await fetch('/api/tournament', {
      method: 'POST',
      body: JSON.stringify(newData),
    });
  };

  const handleScoreChange = (matchId: string, team: 1 | 2, delta: number) => {
    const newData = { ...data };
    const match = newData.matches.find(m => m.id === matchId);
    if (match) {
      if (team === 1) match.score1 = Math.max(0, match.score1 + delta);
      else match.score2 = Math.max(0, match.score2 + delta);
      updateServer(newData);
    }
  };

  const handleFinishMatch = async (matchId: string) => {
    const newData = { ...data };
    const match = newData.matches.find(m => m.id === matchId);
    if (match && match.status !== "FINISHED") {
      const { score1, score2, round } = match;

      // Calculate points based on round rules
      let p1 = 0, p2 = 0;
      if (round === "Group Stage") {
        if (score1 > score2) p1 = 2; else p2 = 2;
      } else if (round === "Semi-finals") {
        if (score1 > score2) { p1 = 3; p2 = 1; } else { p2 = 3; p1 = 1; }
      } else {
        if (score1 > score2) { p1 = 4; p2 = 2; } else { p2 = 4; p1 = 2; }
      }

      match.pointsEarned1 = p1;
      match.pointsEarned2 = p2;
      match.status = "FINISHED";

      // Update team total points
      const t1 = newData.teams.find(t => t.id === match.team1Id);
      const t2 = newData.teams.find(t => t.id === match.team2Id);
      if (t1) t1.points += p1;
      if (t2) t2.points += p2;

      updateServer(newData);
      alert("Match finished and points awarded!");
    }
  };

  const getTeamName = (id: number) => data.teams.find(t => t.id === id)?.name || "Unknown";

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-black uppercase italic mb-8">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter Tournament Key"
            className="w-full bg-white/80 border border-accent/20 rounded-lg p-4 mb-4 text-center outline-none focus:border-primary transition-colors text-foreground"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && password === "1123" && setIsAuthorized(true)}
          />
          <button
            onClick={() => password === "1123" ? setIsAuthorized(true) : alert("Wrong key")}
            className="w-full bg-primary text-white font-black uppercase py-4 rounded-lg hover:brightness-110 transition-all"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const liveMatches = data.matches.filter(m => m.status === "LIVE");
  const upcomingMatches = data.matches.filter(m => m.status === "UPCOMING");

  return (
    <div className="min-h-screen p-8 text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Tournament <span className="gradient-text">Control</span></h1>
          <button onClick={() => window.location.href = "/"} className="px-6 py-2 glass text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors">View Live Dashboard</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Active Matches Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Active & Recent Matches</h2>

            {data.matches.map(match => (
              <div key={match.id} className={`glass p-6 transition-all border-l-4 ${match.status === 'LIVE' ? 'border-primary' : 'border-accent/20'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{match.category}</span>
                    <p className="text-[8px] text-foreground/40 font-bold uppercase mt-1">{match.round}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${match.status === 'LIVE' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                    {match.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <p className="text-xs font-bold mb-2 text-foreground/60">{getTeamName(match.team1Id)}</p>
                    <div className="text-4xl font-black text-foreground">{match.score1}</div>
                    {match.status === "LIVE" && (
                      <div className="flex gap-2 justify-center mt-4">
                        <button onClick={() => handleScoreChange(match.id, 1, -1)} className="w-10 h-10 glass font-bold">-</button>
                        <button onClick={() => handleScoreChange(match.id, 1, 1)} className="w-10 h-10 glass font-bold text-primary hover:bg-primary/20 transition-colors">+</button>
                      </div>
                    )}
                  </div>

                  <div className="text-foreground/20 font-black">VS</div>

                  <div className="flex-1 text-center">
                    <p className="text-xs font-bold mb-2 text-foreground/60">{getTeamName(match.team2Id)}</p>
                    <div className="text-4xl font-black text-foreground">{match.score2}</div>
                    {match.status === "LIVE" && (
                      <div className="flex gap-2 justify-center mt-4">
                        <button onClick={() => handleScoreChange(match.id, 2, -1)} className="w-10 h-10 glass font-bold">-</button>
                        <button onClick={() => handleScoreChange(match.id, 2, 1)} className="w-10 h-10 glass font-bold text-secondary hover:bg-secondary/20 transition-colors">+</button>
                      </div>
                    )}
                  </div>
                </div>

                {match.status === "LIVE" && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <button
                      onClick={() => handleFinishMatch(match.id)}
                      className="w-full py-3 bg-primary text-white font-black uppercase text-xs rounded-lg hover:brightness-110 transition-all"
                    >
                      Finish Match & Award Points
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Standings Preview Column */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Quick Standings</h2>

            <div className="glass p-6 bg-white">
              <h3 className="text-[10px] font-black uppercase text-accent mb-4 border-b border-accent/10 pb-2">Group A</h3>
              <div className="space-y-3">
                {data.teams.filter(t => t.group === "A").sort((a, b) => b.points - a.points).map(team => (
                  <div key={team.id} className="flex justify-between items-center">
                    <span className="text-sm font-bold">{team.name}</span>
                    <span className="text-sm font-black text-primary">{team.points} <span className="text-[8px] text-foreground/40 font-black">PTS</span></span>
                  </div>
                ))}
              </div>

              <h3 className="text-[10px] font-black uppercase text-secondary mt-8 mb-4 border-b border-secondary/10 pb-2">Group B</h3>
              <div className="space-y-3">
                {data.teams.filter(t => t.group === "B").sort((a, b) => b.points - a.points).map(team => (
                  <div key={team.id} className="flex justify-between items-center">
                    <span className="text-sm font-bold">{team.name}</span>
                    <span className="text-sm font-black text-secondary">{team.points} <span className="text-[8px] text-foreground/40 font-black">PTS</span></span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => updateServer(initialData)}
              className="w-full py-4 glass border-magenta/20 text-magenta font-black uppercase text-[10px] tracking-widest hover:bg-magenta/10 transition-all"
            >
              Reset Entire Tournament
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
