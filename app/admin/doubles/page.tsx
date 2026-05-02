"use client";

import { useState } from "react";
import {
  CheckCircle2,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { DoubleCreateForm } from "@/components/admin/DoubleCreateForm";
import { DoubleList } from "@/components/admin/DoubleList";
import { GroupAssignment } from "@/components/admin/GroupAssignment";

export default function AdminDoublesPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  if (!isAuthorized) {
    return <AdminLogin onSuccess={() => setIsAuthorized(true)} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 text-foreground font-be-vietnam-pro">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="p-2 glass rounded-lg hover:text-primary transition-colors">
                <LayoutDashboard className="w-4 h-4 text-zinc-600" />
              </Link>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Quản lý giải đấu</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900">
              Quản lý <span className="gradient-text">Cặp đấu</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-zinc-500">Trạng thái Admin</p>
              <p className="text-sm font-black text-green-600 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3 h-3" /> Đã xác thực
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-5 space-y-8">
            <DoubleCreateForm
              selectedTeamId={selectedTeamId}
              onTeamChange={setSelectedTeamId}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
            />
            <GroupAssignment selectedCategoryId={selectedCategoryId} />
          </div>

          {/* List of Doubles */}
          <DoubleList selectedTeamId={selectedTeamId} />
        </div>
      </div>
    </div>
  );
}
