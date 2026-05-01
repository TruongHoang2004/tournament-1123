"use client";

export function ClubImage() {
  return (
    <div className="relative group mx-auto max-w-3xl">
      <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
      <div className="relative glass aspect-video rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-primary/40 to-accent/40 flex items-center justify-center">
          <span className="text-white font-black italic text-4xl opacity-50">1123 BADMINTON</span>
        </div>
      </div>
    </div>
  );
}
