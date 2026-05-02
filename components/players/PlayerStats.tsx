import { Users, UserCheck, UserMinus } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

interface PlayerStatsProps {
  total: number;
  male: number;
  female: number;
}

export function PlayerStats({ total, male, female }: PlayerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCard
        label="Tổng số VĐV"
        value={total}
        icon={Users}
        iconColor="text-primary"
      />
      <StatCard
        label="Nam"
        value={male}
        icon={UserCheck}
        iconColor="text-secondary"
      />
      <StatCard
        label="Nữ"
        value={female}
        icon={UserMinus}
        iconColor="text-magenta"
      />
    </div>
  );
}
