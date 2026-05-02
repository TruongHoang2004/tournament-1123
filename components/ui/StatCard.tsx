import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: string;
  trendIcon?: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon, iconColor = "text-primary", trend, trendIcon: TrendIcon }: StatCardProps) {
  return (
    <div className="glass p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
        <Icon className={`w-24 h-24 ${iconColor}`} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">{label}</p>
      <h3 className="text-3xl font-black italic text-foreground tracking-tight">{value}</h3>
      {trend && (
        <div className={`mt-4 flex items-center ${iconColor} text-xs font-black uppercase tracking-widest`}>
          {TrendIcon && <TrendIcon className="w-3 h-3 mr-1" />}
          {trend}
        </div>
      )}
    </div>
  );
}
