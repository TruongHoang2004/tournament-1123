"use client";

import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        onSuccess();
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error("Sai thông tin đăng nhập!");
      }
    } catch (err) {
      toast.error("Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 w-full max-w-md text-center border-white/10">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-black uppercase italic mb-2">Admin Access</h1>
        <p className="text-zinc-500 text-sm mb-8 font-medium">Xác thực quyền quản trị viên</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Tên đăng nhập (admin)"
            className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 placeholder:text-zinc-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            placeholder="Mật khẩu (1123)"
            className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-zinc-900 placeholder:text-zinc-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold uppercase py-4 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
