import Link from "next/link";
import { Users, User, ChevronRight } from "lucide-react";
import TeamAvatar from "./TeamAvatar";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    players: { id: string; name: string }[];
  };
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      href={`/tournament/teams/${team.id}`}
      className="group bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors" />

      <div className="flex items-start justify-between mb-8">
        <TeamAvatar name={team.name} size="lg" className="group-hover:scale-110 transition-transform duration-500" />
        <div className="flex -space-x-3">
          {team.players.slice(0, 3).map((p, i) => (
            <div
              key={p.id}
              className="w-8 h-8 rounded-full border-2 border-[#0f0f0f] bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-300"
              title={p.name}
            >
              {p.name.charAt(0)}
            </div>
          ))}
          {team.players.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-[#0f0f0f] bg-blue-900 flex items-center justify-center text-[10px] font-bold text-blue-200">
              +{team.players.length - 3}
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
        {team.name}
      </h3>
      <p className="text-sm text-gray-500 mb-6 flex items-center">
        <Users className="w-4 h-4 mr-2" />
        {team.players.length} Players Registered
      </p>

      <div className="space-y-3 mb-8">
        {team.players.slice(0, 2).map((p) => (
          <div key={p.id} className="flex items-center text-sm text-gray-400">
            <User className="w-3 h-3 mr-3 text-blue-500" />
            <span className="truncate">{p.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
        View Roster details
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
}
