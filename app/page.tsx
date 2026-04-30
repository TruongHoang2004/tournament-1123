"use client";

import Hero from "@/components/Hero";
import { MoveRight, Users, Trophy, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Reusing the beautiful Hero component but with different text for the Club */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/15"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent"></div>
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/25 rounded-full neo-blur"></div>
          <div className="absolute top-10 right-[10%] w-80 h-80 bg-accent/20 rounded-full neo-blur"></div>
          <div className="absolute -bottom-20 right-[20%] w-96 h-96 bg-secondary/20 rounded-full neo-blur"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-primary/20 mb-8 backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-foreground/60">Welcome to 1123 Badminton</span>
          </div>
          
          <h1 className="logo-1123 text-7xl md:text-9xl font-black italic tracking-tighter leading-none mb-4">
            1123
          </h1>
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tight uppercase">
            Badminton Club
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Nơi kết nối đam mê, rèn luyện sức khỏe và chinh phục những đỉnh cao mới cùng bộ môn cầu lông. 
            <span className="block font-black text-primary mt-2 italic">"Vào là không ra!"</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tournament" className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/30 hover:scale-105 transition-all flex items-center gap-2">
              Xem Giải Đấu <MoveRight size={20} />
            </Link>
            <button className="px-8 py-4 bg-white border border-foreground/10 text-foreground font-black uppercase tracking-widest rounded-xl hover:bg-foreground/5 transition-all">
              Tham Gia Câu Lạc Bộ
            </button>
          </div>
        </div>
      </section>

      <main className="w-full">
        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-32 space-y-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-10 text-center space-y-4 hover:border-primary/30 transition-all group flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-black uppercase italic">Cộng Đồng</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">Hơn 50 thành viên nhiệt huyết, từ những người mới chơi đến các tay vợt kỳ cựu.</p>
            </div>
            <div className="glass p-10 text-center space-y-4 hover:border-accent/30 transition-all group flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Trophy size={32} />
              </div>
              <h3 className="text-xl font-black uppercase italic">Giải Đấu</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">Tổ chức các giải đấu nội bộ thường xuyên để cọ xát và nâng cao trình độ chuyên môn.</p>
            </div>
            <div className="glass p-10 text-center space-y-4 hover:border-secondary/30 transition-all group flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-black uppercase italic">Hoạt Động</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">Lịch tập luyện cố định hàng tuần tại các sân cầu lông tiêu chuẩn quốc tế.</p>
            </div>
          </div>

          {/* About Section - Centered */}
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
              Về Chúng Tôi
            </h2>
            <div className="w-20 h-2 bg-primary rounded-full mx-auto"></div>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
              1123 Badminton Club được thành lập với mục tiêu tạo ra một sân chơi lành mạnh, chuyên nghiệp cho những người yêu thích cầu lông. Chúng tôi không chỉ tập trung vào kỹ thuật mà còn chú trọng vào tinh thần đồng đội và sự gắn kết giữa các thành viên.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="glass p-6 flex flex-col items-center gap-3 hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <h4 className="font-black uppercase text-xs">Địa Điểm</h4>
                <p className="text-sm text-foreground/50">Sân Cầu Lông Tân Việt, Quận 10, TP.HCM</p>
              </div>
              <div className="glass p-6 flex flex-col items-center gap-3 hover:border-accent/30 transition-all">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Calendar size={24} />
                </div>
                <h4 className="font-black uppercase text-xs">Lịch Tập</h4>
                <p className="text-sm text-foreground/50">Thứ 3 - 5 - 7 | 18:00 - 21:00</p>
              </div>
            </div>

            {/* Club Image */}
            <div className="relative group mx-auto max-w-3xl">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
              <div className="relative glass aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                  <span className="text-white font-black italic text-4xl opacity-50">1123 BADMINTON</span>
                </div>
              </div>
            </div>
          </div>

          {/* Join Section */}
          <div className="glass p-16 text-center space-y-8 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
            </div>
            
            <h2 className="text-5xl font-black uppercase italic tracking-tighter relative z-10">
              Sẵn Sàng Để Bắt Đầu?
            </h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto relative z-10">
              Đừng ngần ngại gia nhập cộng đồng của chúng tôi ngay hôm nay để nhận được những ưu đãi tập luyện và tham gia các giải đấu hấp dẫn.
            </p>
            <div className="flex justify-center gap-6 relative z-10">
              <button className="px-10 py-5 bg-foreground text-background font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl">
                Đăng Ký Ngay
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
