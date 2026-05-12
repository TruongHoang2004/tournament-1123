import { Loader2, Users } from "lucide-react";
import { DoubleCard } from "./DoubleCard";
import Link from "next/link";

interface DoublesGridProps {
  doubles: any[];
  isLoading: boolean;
}

export function DoublesGrid({ doubles, isLoading }: DoublesGridProps) {
  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="font-bold uppercase tracking-widest text-xs">Đang tải danh sách...</p>
      </div>
    );
  }

  if (doubles.length === 0) {
    return (
      <div className="py-32 glass text-center border-dashed">
        <Users className="w-16 h-16 mx-auto mb-6 opacity-10" />
        <p className="text-zinc-500 font-bold">Không tìm thấy bộ đôi nào phù hợp với bộ lọc.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {doubles.map((double) => (
        <Link key={double.id} href={`/doubles/${double.id}`} className="block h-full cursor-pointer group">
          <DoubleCard double={double} />
        </Link>
      ))}
    </div>
  );
}
