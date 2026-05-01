"use client";

import { MapPin, Calendar } from "lucide-react";
import { ClubInfoCard } from "../common/ClubInfoCard";
import { ClubImage } from "./ClubImage";

export function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-12 md:space-y-16">
      <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
        Về Chúng Tôi
      </h2>
      <div className="w-20 h-2 bg-primary rounded-full mx-auto my-8"></div>
      <p className="text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto mb-12">
        1123 Badminton Club được thành lập với mục tiêu tạo ra một sân chơi lành mạnh, chuyên nghiệp cho những người yêu thích cầu lông. Chúng tôi không chỉ tập trung vào kỹ thuật mà còn chú trọng vào tinh thần đồng đội và sự gắn kết giữa các thành viên.
      </p>
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClubInfoCard 
          icon={MapPin} 
          iconBg="bg-primary/10 text-primary" 
          label="Địa Điểm" 
          value="Sân Cầu Lông Tân Việt, Quận 10, TP.HCM" 
        />
        <ClubInfoCard 
          icon={Calendar} 
          iconBg="bg-accent/10 text-accent" 
          label="Lịch Tập" 
          value="Thứ 3 - 5 - 7 | 18:00 - 21:00" 
        />
      </div>

      <ClubImage />
    </div>
  );
}
