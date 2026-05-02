import { Search, X } from "lucide-react";

interface PlayerFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
  selectedTeam: string;
  onTeamChange: (value: string) => void;
  options: {
    teams: string[];
    levels: number[];
  };
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function PlayerFilters({
  searchQuery,
  onSearchChange,
  selectedGender,
  onGenderChange,
  selectedLevel,
  onLevelChange,
  selectedTeam,
  onTeamChange,
  options,
  hasActiveFilters,
  onReset,
}: PlayerFiltersProps) {
  return (
    <div className="glass p-6 rounded-3xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm tên VĐV..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/40 backdrop-blur-md border border-foreground/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-sm text-foreground font-medium placeholder:text-foreground/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Giới tính</label>
            <select
              value={selectedGender}
              onChange={(e) => onGenderChange(e.target.value)}
              className="bg-white/40 backdrop-blur-md border border-foreground/10 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-primary/40 transition-all cursor-pointer"
            >
              <option value="ALL">Tất cả giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Trình độ</label>
            <select
              value={selectedLevel}
              onChange={(e) => onLevelChange(e.target.value)}
              className="bg-white/40 backdrop-blur-md border border-foreground/10 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-primary/40 transition-all cursor-pointer"
            >
              <option value="ALL">Tất cả trình độ</option>
              {options.levels.map((level) => (
                <option key={level} value={level.toString()}>Trình {level}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Đội tuyển</label>
            <select
              value={selectedTeam}
              onChange={(e) => onTeamChange(e.target.value)}
              className="bg-white/40 backdrop-blur-md border border-foreground/10 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-primary/40 transition-all cursor-pointer max-w-[150px]"
            >
              <option value="ALL">Tất cả đội</option>
              {options.teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-xs font-black uppercase tracking-widest group"
            >
              <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
