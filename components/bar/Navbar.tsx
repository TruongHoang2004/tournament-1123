"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Home,
  Swords,
  Trophy,
  GitBranch,
  Users,
  UserRound,
  Handshake,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/matches", label: "Trận đấu", icon: Swords },
  { href: "/standings", label: "Bảng đấu", icon: Users },
  { href: "/rankings", label: "Bảng xếp hạng", icon: Trophy },
  { href: "/brackets", label: "Sơ đồ thi đấu", icon: GitBranch },
  { href: "/teams", label: "Team", icon: Users },
  { href: "/doubles", label: "Cặp đôi", icon: Handshake },
  { href: "/players", label: "VĐV", icon: UserRound },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* ====== Desktop Navbar (md+) ====== */}
        <div className="hidden md:flex w-full h-20 glass border-b border-white/20 backdrop-blur-2xl bg-white/60 px-12 items-center gap-16 shadow-xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-auto px-3 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <span className="text-white text-xl font-black italic p-1">
                1123
              </span>
            </div>
            <div className="flex flex-col">
              <span className="logo-1123 text-2xl font-black italic tracking-tighter leading-none">
                1123
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                Badminton
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item, index) => (
              <div key={item.href} className="flex items-center gap-6">
                {index === 1 && (
                  <div className="w-px h-4 bg-foreground/10 mx-2"></div>
                )}
                <Link
                  href={item.href}
                  className={`group relative py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-foreground/60 hover:text-primary"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isActive(item.href)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ====== Mobile Top Bar (< md) ====== */}
        <div className="flex md:hidden w-full h-16 border-b border-white/20 backdrop-blur-2xl bg-white/80 px-4 items-center justify-between shadow-lg">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="h-9 w-auto px-2.5 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="text-white text-lg font-black italic">
                1123
              </span>
            </div>
            <div className="flex flex-col">
              <span className="logo-1123 text-xl font-black italic tracking-tighter leading-none">
                1123
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-foreground/40">
                Badminton
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all active:scale-90"
            aria-label="Toggle menu"
          >
            <Menu
              className={`w-5 h-5 text-slate-700 absolute transition-all duration-300 ${
                mobileMenuOpen
                  ? "opacity-0 rotate-90 scale-50"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <X
              className={`w-5 h-5 text-slate-700 absolute transition-all duration-300 ${
                mobileMenuOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-50"
              }`}
            />
          </button>
        </div>

        {/* Invisible trigger area to show navbar on hover when hidden (desktop only) */}
        {!isVisible && (
          <div
            className="absolute top-full left-0 right-0 h-4 cursor-pointer hidden md:block"
            onMouseEnter={() => setIsVisible(true)}
          ></div>
        )}
      </nav>

      {/* ====== Mobile Menu Overlay (< md) ====== */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-in Panel */}
        <div
          className={`absolute top-16 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-out overflow-y-auto ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <div className="p-5 space-y-2">
            {/* Active route indicator label */}
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 px-4 pb-2">
              Điều hướng
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] ${
                    active
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      active
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-black ${
                        active ? "text-primary" : "text-slate-800"
                      }`}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">
                        Đang xem
                      </span>
                    )}
                  </div>

                  {active && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Footer branding in menu */}
          <div className="mt-4 mx-5 pt-4 border-t border-slate-100 pb-8">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 text-center">
              1123 Badminton Tournament
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
