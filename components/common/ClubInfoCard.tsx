"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ClubInfoCardProps {
  icon: LucideIcon;
  iconBg: string;
  label: string;
  value: string;
  link?: string;
}

export function ClubInfoCard({ icon: Icon, iconBg, label, value, link }: ClubInfoCardProps) {
  const isExternal = Boolean(link && /^https?:\/\//.test(link));

  return (
    <div className="glass p-6 flex flex-col items-center gap-3 hover:border-primary/30 transition-all">
      <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
        <Icon size={24} />
      </div>
      <h4 className="font-black uppercase text-xs">{label}</h4>
      <p className="text-sm text-foreground/50">{value}</p>
      {link && (
        <Link
          href={link}
          className="text-primary hover:underline"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          Tim hieu them
        </Link>
      )}
    </div>
  );
}
