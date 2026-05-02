"use client";

import { useState, useMemo } from "react";
import {
  useTeams,
  useCategories,
  usePlayers,
  useCreateDouble
} from "@/services";
import {
  UserPlus,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface DoubleCreateFormProps {
  selectedTeamId: string;
  onTeamChange: (id: string) => void;
}

export function DoubleCreateForm({ selectedTeamId, onTeamChange }: DoubleCreateFormProps) {
  // Form State
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
  const [point, setPoint] = useState(0);

  // Queries
  const { data: teams } = useTeams();
  const { data: categories } = useCategories();
  const { data: players } = usePlayers();

  // Mutation
  const createDouble = useCreateDouble();

  // Derived Data
  const teamPlayers = useMemo(() => {
    if (!selectedTeamId || !players) return [];
    return players.filter((p: any) => p.teamId === selectedTeamId);
  }, [selectedTeamId, players]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !selectedCategoryId || !player1Id || !player2Id) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await createDouble.mutateAsync({
        teamId: selectedTeamId,
        categoryId: selectedCategoryId,
        player1Id,
        player2Id,
        point,
      });

      // Reset form
      setPlayer1Id("");
      setPlayer2Id("");
      toast.success("Tạo bộ đôi thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Lỗi khi tạo bộ đôi");
    }
  };

  return (
    <div className="glass p-8 border-white/10 sticky top-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Thêm bộ đôi mới</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Đội tuyển</label>
          <div className="relative">
            <select
              value={selectedTeamId}
              onChange={(e) => {
                onTeamChange(e.target.value);
                setPlayer1Id("");
                setPlayer2Id("");
              }}
              className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 appearance-none cursor-pointer"
            >
              <option value="">Chọn đội...</option>
              {teams?.map((team: any) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Hạng mục thi đấu</label>
          <div className="relative">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 appearance-none cursor-pointer"
            >
              <option value="">Chọn hạng mục...</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Players Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Vận động viên 1</label>
            <select
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              disabled={!selectedTeamId}
              className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 appearance-none cursor-pointer disabled:opacity-50 disabled:bg-zinc-50"
            >
              <option value="">Chọn VĐV...</option>
              {teamPlayers.map((p: any) => (
                <option key={p.id} value={p.id} disabled={p.id === player2Id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Vận động viên 2</label>
            <select
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              disabled={!selectedTeamId}
              className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 appearance-none cursor-pointer disabled:opacity-50 disabled:bg-zinc-50"
            >
              <option value="">Chọn VĐV...</option>
              {teamPlayers.map((p: any) => (
                <option key={p.id} value={p.id} disabled={p.id === player1Id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={createDouble.isPending}
            className="w-full bg-primary text-white font-black uppercase py-4 rounded-xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {createDouble.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Xác nhận tạo cặp
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-[11px] text-blue-800 leading-relaxed">
          <p className="font-bold text-blue-900 mb-1">Quy tắc bắt buộc:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Hai vận động viên phải cùng thuộc một đội tuyển.</li>
            <li>Mỗi vận động viên chỉ tham gia tối đa 1 nội dung.</li>
            <li>Mỗi đội chỉ có duy nhất 1 bộ đôi cho mỗi nội dung.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
