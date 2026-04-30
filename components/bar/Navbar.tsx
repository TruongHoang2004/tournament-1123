"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="w-full h-20 glass border-b border-white/20 backdrop-blur-2xl bg-white/60 px-12 flex items-center gap-16 shadow-xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-auto px-3 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="text-white text-xl font-black italic p-1">1123</span>
          </div>
          <div className="flex flex-col">
            <span className="logo-1123 text-2xl font-black italic tracking-tighter leading-none">1123</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Badminton</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`group relative py-2 text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/' ? 'text-primary' : 'text-foreground/60 hover:text-primary'
              }`}
          >
            Club Home
            <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          
          <div className="w-[1px] h-4 bg-foreground/10 mx-2"></div>

          <Link
            href="/tournament"
            className={`group relative py-2 text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/tournament' ? 'text-primary' : 'text-foreground/60 hover:text-primary'
              }`}
          >
            Tournament
            <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${pathname === '/tournament' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link
            href="/brackets"
            className={`group relative py-2 text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/brackets' ? 'text-primary' : 'text-foreground/60 hover:text-primary'
              }`}
          >
            Brackets
            <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${pathname === '/brackets' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link
            href="/teams"
            className={`group relative py-2 text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/teams' ? 'text-primary' : 'text-foreground/60 hover:text-primary'
              }`}
          >
            Teams
            <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${pathname === '/teams' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          
          <Link
            href="/admin"
            className={`group relative py-2 text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/admin' ? 'text-accent' : 'text-foreground/60 hover:text-accent'
              }`}
          >
            Admin
            <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${pathname === '/admin' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
        </div>
      </div>

      {/* Invisible trigger area to show navbar on hover when hidden */}
      {!isVisible && (
        <div
          className="absolute top-full left-0 right-0 h-4 cursor-pointer"
          onMouseEnter={() => setIsVisible(true)}
        ></div>
      )}
    </nav>
  );
}
