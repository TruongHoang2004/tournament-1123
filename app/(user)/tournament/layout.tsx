"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, Users, Sword } from "lucide-react";

export default function TournamentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/tournament", icon: LayoutDashboard },
    { name: "Brackets", href: "/tournament/brackets", icon: Trophy },
    { name: "Teams", href: "/tournament/teams", icon: Users },
    { name: "Matches", href: "/tournament/matches", icon: Sword },
  ];

  return (
    <div className="min-h-screen bg-transparent text-foreground pt-24">
      {/* Sub-navbar for Tournament navigation */}
      <div className="sticky top-20 z-40 glass border-b border-white/20 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(232,118,45,0.12)]"
                      : "text-foreground/60 hover:text-primary hover:bg-white/60"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {children}
      </main>
    </div>
  );
}
