"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/services";
import { Users, Loader2, LayoutGrid } from "lucide-react";

export default function StandingsPage() {
  const { data: categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [standings, setStandings] = useState<{
    groupA: any[];
    groupB: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categories?.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategoryId) {
      setIsLoading(true);
      fetch(`/api/standings?categoryId=${selectedCategoryId}`)
        .then((res) => res.json())
        .then((data) => {
          setStandings(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [selectedCategoryId]);

  const renderGroupCard = (groupName: string, data: any[]) => (
    <div className="glass p-4 md:p-6 overflow-hidden">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
          Bảng {groupName}
        </h2>
        <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
          {data?.length || 0} đội
        </span>
      </div>

      {data?.length === 0 ? (
        <div className="py-8 text-center text-zinc-400 font-bold text-sm">
          Chưa có đội nào được phân bảng
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((team, index) => (
            <div
              key={team.doubleId}
              className="flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-white/60 border border-zinc-100 hover:border-primary/20 hover:shadow-sm transition-all"
            >
              <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-zinc-900 truncate">
                  {team.teamName}
                </p>
                <p className="text-[10px] text-zinc-400 truncate">
                  {team.player1Name} & {team.player2Name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <section className="relative pt-20 md:pt-28 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Vòng bảng
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-zinc-900">
            Bảng đấu{" "}
            <span className="gradient-text">Group Stage</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm max-w-2xl">
            Danh sách các đội trong từng bảng đấu. 2 đội đứng đầu mỗi bảng sẽ
            tiến vào vòng Bán kết.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-10">
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategoryId === cat.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "bg-white/50 border border-foreground/5 text-foreground/40 hover:bg-white hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {renderGroupCard("A", standings?.groupA || [])}
            {renderGroupCard("B", standings?.groupB || [])}
          </div>
        )}
      </section>
    </div>
  );
}
