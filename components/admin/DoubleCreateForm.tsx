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
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
}

export function DoubleCreateForm({ selectedTeamId, onTeamChange, selectedCategoryId, onCategoryChange }: DoubleCreateFormProps) {
  // Form State
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

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId || !categories) return null;
    return categories.find((c: any) => c.id === selectedCategoryId);
  }, [selectedCategoryId, categories]);

  // VĐV 1 hợp lệ dựa trên hạng mục thi đấu đã chọn
  const eligiblePlayers1 = useMemo(() => {
    if (!teamPlayers || !selectedCategory) return teamPlayers;

    const code = selectedCategory.code;
    return teamPlayers.filter((p: any) => {
      if (code === "MIXED_ADVANCED") {
        const isMale12 = p.gender === "MALE" && [1, 2].includes(p.level);
        const isFemale1 = p.gender === "FEMALE" && p.level === 1;
        return isMale12 || isFemale1;
      }
      if (code === "MIXED_INTERMEDIATE") {
        const isMale35 = p.gender === "MALE" && [3, 4, 5].includes(p.level);
        const isFemale2 = p.gender === "FEMALE" && p.level === 2;
        return isMale35 || isFemale2;
      }
      if (code === "MEN_MIXED") {
        const isMale14 = p.gender === "MALE" && [1, 2, 3, 4].includes(p.level);
        return isMale14;
      }
      return true;
    });
  }, [teamPlayers, selectedCategory]);

  // VĐV 2 hợp lệ dựa trên hạng mục thi đấu và VĐV 1 đã chọn
  const eligiblePlayers2 = useMemo(() => {
    if (!teamPlayers || !selectedCategory) return teamPlayers;

    const code = selectedCategory.code;
    
    if (!player1Id) {
      return eligiblePlayers1;
    }

    const p1 = teamPlayers.find((p: any) => p.id === player1Id);
    if (!p1) return eligiblePlayers1;

    return teamPlayers.filter((p: any) => {
      if (p.id === player1Id) return false;

      if (code === "MIXED_ADVANCED") {
        const isP1Male12 = p1.gender === "MALE" && [1, 2].includes(p1.level);
        const isP1Female1 = p1.gender === "FEMALE" && p1.level === 1;

        if (isP1Male12) {
          return p.gender === "FEMALE" && p.level === 1;
        }
        if (isP1Female1) {
          return p.gender === "MALE" && [1, 2].includes(p.level);
        }
        return false;
      }

      if (code === "MIXED_INTERMEDIATE") {
        const isP1Male35 = p1.gender === "MALE" && [3, 4, 5].includes(p1.level);
        const isP1Female2 = p1.gender === "FEMALE" && p1.level === 2;

        if (isP1Male35) {
          return p.gender === "FEMALE" && p.level === 2;
        }
        if (isP1Female2) {
          return p.gender === "MALE" && [3, 4, 5].includes(p.level);
        }
        return false;
      }

      if (code === "MEN_MIXED") {
        const isP1Male12 = p1.gender === "MALE" && [1, 2].includes(p1.level);
        const isP1Male34 = p1.gender === "MALE" && [3, 4].includes(p1.level);

        if (isP1Male12) {
          return p.gender === "MALE" && [3, 4].includes(p.level);
        }
        if (isP1Male34) {
          return p.gender === "MALE" && [1, 2].includes(p.level);
        }
        return false;
      }

      return true;
    });
  }, [teamPlayers, selectedCategory, player1Id, eligiblePlayers1]);

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
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Đội</label>
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
              onChange={(e) => {
                onCategoryChange(e.target.value);
                setPlayer1Id("");
                setPlayer2Id("");
              }}
              className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 appearance-none cursor-pointer"
            >
              <option value="">Chọn hạng mục...</option>
              {categories?.filter((cat: any) => ["MIXED_ADVANCED", "MIXED_INTERMEDIATE", "MEN_MIXED"].includes(cat.code))?.map((cat: any) => (
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
              onChange={(e) => {
                setPlayer1Id(e.target.value);
                setPlayer2Id(""); // Reset VĐV 2 để lọc lại chính xác
              }}
              disabled={!selectedTeamId || !selectedCategoryId}
              className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 appearance-none cursor-pointer disabled:opacity-50 disabled:bg-zinc-50"
            >
              <option value="">Chọn VĐV...</option>
              {eligiblePlayers1.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} ({p.gender === "MALE" ? "Nam" : "Nữ"} - Trình {p.level})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Vận động viên 2</label>
            <select
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              disabled={!selectedTeamId || !selectedCategoryId || !player1Id}
              className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 appearance-none cursor-pointer disabled:opacity-50 disabled:bg-zinc-50"
            >
              <option value="">Chọn VĐV...</option>
              {eligiblePlayers2.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} ({p.gender === "MALE" ? "Nam" : "Nữ"} - Trình {p.level})</option>
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
          <ul className="list-disc ml-4 space-y-1 text-zinc-600">
            <li>Hai vận động viên phải cùng thuộc một đội tuyển.</li>
            <li>Mỗi vận động viên chỉ tham gia tối đa <strong className="text-zinc-900">2 nội dung</strong>.</li>
            <li>Mỗi đội chỉ có duy nhất 1 bộ đôi cho mỗi nội dung.</li>
            <li className="font-bold text-blue-700">Đôi nam nữ nâng cao: VĐV Nam (trình 1/2) + VĐV Nữ (trình 1).</li>
            <li className="font-bold text-blue-700">Đôi nam nữ trung cấp: VĐV Nam (trình 3/4/5) + VĐV Nữ (trình 2).</li>
            <li className="font-bold text-blue-700">Đôi nam hỗn hợp: VĐV Nam (trình 1/2) + VĐV Nam (trình 3/4).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
