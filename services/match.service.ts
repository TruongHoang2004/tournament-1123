import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentKeys } from "./tournament.service";

export const matchService = {
  getAllByTournament: async (tournamentId: string) => {
    const res = await api.get("/matches", { params: { tournamentId } });
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
};

export const matchKeys = {
  all: ["matches"] as const,
  list: (tournamentId: string) => [...matchKeys.all, "list", { tournamentId }] as const,
  detail: (id: string) => [...matchKeys.all, "detail", id] as const,
};

export function useMatches(tournamentId: string | undefined) {
  return useQuery({
    queryKey: matchKeys.list(tournamentId!),
    queryFn: () => matchService.getAllByTournament(tournamentId!),
    enabled: !!tournamentId,
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
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all });
    },
  });
}
