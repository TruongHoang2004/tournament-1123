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
        <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">{title}</h2>
        {subtitle && <p className="text-foreground/60 mt-2 font-medium">{subtitle}</p>}
      </div>
      {badge && (
        <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] self-start md:self-center shadow-sm shadow-primary/5">
          {badge}
        </span>
      )}
    </div>
  );
}
