import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface AssignGroupsInput {
  categoryId: string;
  assignments: { doubleId: string; group: string | null }[];
}

export interface EndGroupStageInput {
  categoryId: string;
  overrides?: {
    groupA1?: string;
    groupA2?: string;
    groupB1?: string;
    groupB2?: string;
  };
}

export const tournamentService = {
  assignGroups: async (data: AssignGroupsInput) => {
    const res = await api.post("/doubles/assign-groups", data);
    return res.data;
  },

  initBracket: async (categoryId: string) => {
    const res = await api.post("/tournament/init-bracket", { categoryId });
    return res.data;
  },

  endGroupStage: async (data: EndGroupStageInput) => {
    const res = await api.post("/tournament/end-group-stage", data);
    return res.data;
  },
};

export function useAssignGroups() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignGroupsInput) => tournamentService.assignGroups(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles"] });
    },
  });
}

export function useInitBracket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => tournamentService.initBracket(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useEndGroupStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EndGroupStageInput) => tournamentService.endGroupStage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
