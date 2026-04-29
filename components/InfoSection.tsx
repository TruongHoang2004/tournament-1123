"use client";

export default function InfoSection() {
  const categories = [
    { cat: "Advanced Men's Doubles", color: "bg-primary/10 border-primary" },
    { cat: "Mixed-Level Men's Doubles", color: "bg-accent/10 border-accent" },
    { cat: "Intermediate Men's Doubles", color: "bg-secondary/10 border-secondary" },
    { cat: "Advanced Mixed Doubles", color: "bg-magenta/10 border-magenta" },
    { cat: "Intermediate Mixed Doubles", color: "bg-primary-light/10 border-primary-light" },
    { cat: "Women's Doubles", color: "bg-accent/10 border-accent" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass p-8 border-accent/15 bg-gradient-to-br from-accent/5 to-magenta/5 text-center">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-foreground">Tournament Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">01</div>
            <h4 className="text-xs font-black uppercase text-foreground/80">Points Accumulation</h4>
            <p className="text-[10px] text-foreground/50 leading-relaxed">A team&apos;s total score is the sum of points earned across all 6 match categories.</p>
          </div>
          <div className="space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-xs font-black shadow-lg shadow-accent/20">02</div>
            <h4 className="text-xs font-black uppercase text-foreground/80">Scoring System</h4>
            <p className="text-[10px] text-foreground/50 leading-relaxed">
              Group Stage: Win 2, Loss 0<br />
              Semi-finals: Win 3, Loss 1<br />
              Finals: Win 4, Loss 2
            </p>
          </div>
          <div className="space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-secondary/20">03</div>
            <h4 className="text-xs font-black uppercase text-foreground/80">Match Structure</h4>
            <p className="text-[10px] text-foreground/50 leading-relaxed">Each category is independent. No single team-vs-team match exists.</p>
          </div>
        </div>
        <div className="mt-10 p-4 bg-primary/10 rounded-xl border border-primary/20 inline-block px-12">
          <p className="text-[10px] font-black uppercase text-foreground/40 mb-1">Official Match Day</p>
          <p className="text-xl font-black text-primary uppercase italic">May 17, 2026</p>
        </div>
      </div>

      <div className="glass p-8 text-center">
        <h2 className="text-lg font-black uppercase italic tracking-tighter mb-6 text-foreground">Match Categories</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((item, i) => (
            <div key={i} className={`text-[10px] font-black uppercase text-foreground/60 border-b-2 ${item.color} px-4 py-2 rounded-t-lg transition-all hover:-translate-y-1`}>
              {item.cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
