import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const matchService = {
  getAllByTournament: async () => {
    const res = await api.get("/matches");
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/matches/${id}`);
    return res.data;
  },

  updateScore: async (matchId: string, setNumber: number, scoreA: number, scoreB: number) => {
    const res = await api.patch(`/matches/${matchId}`, {
      action: "updateScore",
      setNumber,
      scoreA,
      scoreB,
    });
    return res.data;
  },

  finalize: async (matchId: string) => {
    const res = await api.patch(`/matches/${matchId}`, { action: "finalize" });
    return res.data;
  },

  startMatch: async (matchId: string) => {
    const res = await api.patch(`/matches/${matchId}`, { action: "startMatch" });
    return res.data;
  },

  resetMatch: async (matchId: string) => {
    const res = await api.patch(`/matches/${matchId}`, { action: "resetMatch" });
    return res.data;
  },

  reorder: async (timelineMatchId: string, direction: "up" | "down") => {
    const res = await api.post("/timeline/reorder", { timelineMatchId, direction });
    return res.data;
  },
};

export const matchKeys = {
  all: ["matches"] as const,
  list: () => [...matchKeys.all, "list"] as const,
  detail: (id: string) => [...matchKeys.all, "detail", id] as const,
};

export function useMatches() {
  return useQuery({
    queryKey: matchKeys.list(),
    queryFn: () => matchService.getAllByTournament(),
    enabled: true,
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: matchKeys.detail(id),
    queryFn: () => matchService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, setNumber, scoreA, scoreB }: { matchId: string; setNumber: number; scoreA: number; scoreB: number }) =>
      matchService.updateScore(matchId, setNumber, scoreA, scoreB),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}

export function useFinalizeMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => matchService.finalize(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}

export function useStartMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => matchService.startMatch(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}

export function useResetMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => matchService.resetMatch(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}

export function useReorderMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: "up" | "down" }) => 
      matchService.reorder(id, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
