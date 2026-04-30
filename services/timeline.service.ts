import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const timelineService = {
  getTimeline: async (tournamentId: string, categoryCode?: string) => {
    const res = await api.get("/timeline", {
      params: { tournamentId, category: categoryCode },
    });
    return res.data;
  },
};

export const timelineKeys = {
  all: ["timeline"] as const,
  detail: (tournamentId: string, categoryCode?: string) =>
    [...timelineKeys.all, tournamentId, { categoryCode }] as const,
};

export function useTimeline(tournamentId: string | undefined, categoryCode: string | null) {
  return useQuery({
    queryKey: timelineKeys.detail(tournamentId!, categoryCode!),
    queryFn: () => timelineService.getTimeline(tournamentId!, categoryCode!),
    enabled: !!tournamentId && !!categoryCode,
  });
}
