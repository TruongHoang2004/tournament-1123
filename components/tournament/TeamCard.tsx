import Link from "next/link";
import { Users, User, ChevronRight } from "lucide-react";
import TeamAvatar from "./TeamAvatar";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    players: { id: string; name: string; gender: string; level: number }[];
  };
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className="group glass p-8 hover:border-primary transition-all duration-500 relative overflow-hidden flex flex-col"
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex items-start justify-between mb-8 relative z-10">
        <TeamAvatar name={team.name} size="lg" className="group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/10" />
        <div className="flex -space-x-3">
          {team.players.slice(0, 6).map((p, i) => (
            <div
              key={p.id}
              className="w-10 h-10 rounded-full border-2 border-white bg-white/80 backdrop-blur-sm flex items-center justify-center text-xs font-black italic text-primary shadow-sm"
              title={p.name}
            >
              {p.name.charAt(0)}
            </div>
          ))}
          {team.players.length > 6 && (
            <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs font-black shadow-sm">
              +{team.players.length - 6}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-1">
        <h3 className="text-2xl font-black italic text-foreground tracking-tight group-hover:text-primary transition-colors mb-2 uppercase">
          {team.name}
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-6 flex items-center">
          <Users className="w-3 h-3 mr-2 text-primary" />
          {team.players.length} vận động viên
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {team.players.slice(0, 6).map((p) => (
            <div key={p.id} className="flex items-center gap-2 p-2 rounded-xl bg-foreground/5 group-hover:bg-primary/5 transition-colors">
              <div className={`w-1.5 h-1.5 rounded-full ${p.gender === 'MALE' ? 'bg-secondary' : 'bg-magenta'}`}></div>
              <span className="text-xs font-bold text-foreground/70 truncate">{p.name}</span>
            </div>
          ))}
          {team.players.length > 6 && (
            <div className="flex items-center justify-center p-2 rounded-xl border border-dashed border-foreground/10 text-[10px] font-black text-foreground/30 uppercase tracking-widest">
              và {team.players.length - 6} người khác
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between relative z-10">
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
          Chi tiết đội hình
        </span>
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
