interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, badge, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${className}`}>
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
      </div>
      {badge && (
        <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-widest self-start md:self-center">
          {badge}
        </span>
      )}
    </div>
  );
}
