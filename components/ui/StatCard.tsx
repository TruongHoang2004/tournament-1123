import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: string;
  trendIcon?: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon, iconColor = "text-blue-500", trend, trendIcon: TrendIcon }: StatCardProps) {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <Icon className={`w-24 h-24 ${iconColor}`} />
      </div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      {trend && (
        <div className={`mt-4 flex items-center ${iconColor} text-sm font-semibold`}>
          {TrendIcon && <TrendIcon className="w-4 h-4 mr-1" />}
          {trend}
        </div>
      )}
    </div>
  );
}
