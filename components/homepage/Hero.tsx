"use client";

export default function Hero() {
  return (
    <section className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-magenta/15 to-secondary/15"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent"></div>
        {/* Decorative blurred orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent/25 rounded-full neo-blur"></div>
        <div className="absolute top-10 right-[10%] w-80 h-80 bg-magenta/20 rounded-full neo-blur"></div>
        <div className="absolute -bottom-20 right-[20%] w-96 h-96 bg-secondary/20 rounded-full neo-blur"></div>
        <div className="absolute top-[20%] left-[35%] w-60 h-60 bg-primary/15 rounded-full neo-blur"></div>
      </div>
      
      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-accent/20 mb-8 backdrop-blur-sm shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-foreground/60">Live Tournament Tracker</span>
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="logo-1123 text-8xl md:text-9xl font-black italic tracking-tighter leading-none">
            1123
          </h1>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mt-2 tracking-tight uppercase">
            Badminton
          </h2>
          <div className="w-16 h-1 bg-primary mt-4 mb-6 rounded-full opacity-50"></div>
          <p className="text-sm md:text-base text-foreground font-black tracking-[0.3em] uppercase opacity-80">
            Vào là không ra!
          </p>
          <p className="text-xs md:text-sm text-accent/70 font-bold tracking-[0.2em] uppercase mt-2">
            Internal Championship 2026
          </p>
        </div>
      </div>
    </section>
  );
}
