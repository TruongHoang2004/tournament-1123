"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Users, Trophy, LogOut, Home, Shuffle, Calendar } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Doubles Management", href: "/admin/doubles", icon: Users },
    { name: "Group Assignment", href: "/admin/groups", icon: Shuffle },
    { name: "Match Management", href: "/admin/matches", icon: Calendar },
    { name: "Tournament Settings", href: "/admin/settings", icon: Trophy },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="w-full h-20 glass border-b border-accent/20 backdrop-blur-2xl bg-slate-900/90 px-12 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-12">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="h-10 w-auto px-3 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
              <span className="text-white text-xl font-black italic p-1">ADMIN</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-2xl font-black italic tracking-tighter leading-none">1123</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60">Tournament</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-accent' : 'text-slate-400 hover:text-accent'
                    }`}
                >
                  <Icon size={14} />
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-xs font-bold"
          >
            <Home size={14} />
            Public View
          </Link>
          <button
            onClick={() => {/* TODO: Logout logic */}}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      {!isVisible && (
        <div
          className="absolute top-full left-0 right-0 h-4 cursor-pointer"
          onMouseEnter={() => setIsVisible(true)}
        ></div>
      )}
    </nav>
  );
}
