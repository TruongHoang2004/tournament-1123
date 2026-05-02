import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const timelineService = {
  getTimeline: async (tournamentId: string, categoryCode?: string) => {
    const res = await api.get("/timeline", {
      params: {  category: categoryCode },
    });
    return res.data;
  },
};

export const timelineKeys = {
  all: ["timeline"] as const,
  detail: (tournamentId: string, categoryCode?: string) =>
    [...timelineKeys.all, tournamentId, { categoryCode }] as const,
};

export function useTimeline( categoryCode: string | null) {
  return useQuery({
    queryKey: timelineKeys.detail( categoryCode!),
    queryFn: () => timelineService.getTimeline( categoryCode!),
    enabled:  !!categoryCode,
  });
}
