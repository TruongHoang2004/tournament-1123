"use client";

import { Users, Trophy, Calendar } from "lucide-react";
import { ClubInfoCard } from "../common/ClubInfoCard";

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <ClubInfoCard 
        icon={Users} 
        iconBg="bg-primary/10 text-primary" 
        label="Thành Viên" 
        value="Hơn 50 thành viên nhiệt huyết, từ những người mới chơi đến các tay vợt kỳ cựu." 
      />
      <ClubInfoCard 
        icon={Trophy} 
        iconBg="bg-secondary/10 text-secondary" 
        label="Giải Đấu" 
        value="Tổ chức các giải đấu nội bộ thường xuyên để cọ xát và nâng cao trình độ chuyên môn." 
      />
      <ClubInfoCard 
        icon={Calendar} 
        iconBg="bg-accent/10 text-accent" 
        label="Hoạt Động" 
        value="Lịch tập luyện cố định hàng tuần tại các sân cầu lông tiêu chuẩn quốc tế." 
      />
    </div>
  );
}
