import { Search, Filter, Trophy } from "lucide-react";

interface DoublesFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTeamId: string;
  setSelectedTeamId: (id: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  teams: any[];
  categories: any[];
  count: number;
}

export function DoublesFilters({
  searchQuery,
  setSearchQuery,
  selectedTeamId,
  setSelectedTeamId,
  selectedCategoryId,
  setSelectedCategoryId,
  teams,
  categories,
  count
}: DoublesFiltersProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-12">
      <div className="glass p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm vận động viên, đội..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Team Filter */}
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <select
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary appearance-none text-sm cursor-pointer"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
            >
              <option value="all">Tất cả đội</option>
              {teams?.map((team: any) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative w-full md:w-48">
            <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <select
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary appearance-none text-sm cursor-pointer"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="all">Tất cả nội dung</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-zinc-400 text-xs font-bold">
          Hiển thị <span className="text-primary">{count}</span> bộ đôi
        </div>
      </div>
    </section>
  );
}
