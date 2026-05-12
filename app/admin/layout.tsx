"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminNavbar from "@/components/bar/AdminNavbar";
import { AdminLogin } from "@/components/admin/AdminLogin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          setIsAuthorized(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Xác thực phiên làm việc...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <AdminLogin onSuccess={() => setIsAuthorized(true)} />;
  }

  return (
    <>
      <AdminNavbar />
      <div className="pt-20">
        {children}
      </div>
    </>
  );
}
