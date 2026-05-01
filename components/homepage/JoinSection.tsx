export function JoinSection() {
  return (
    <div className="glass p-16 text-center space-y-8 bg-linear-to-r from-primary/10 via-accent/10 to-secondary/10 overflow-hidden relative">
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
  );
}