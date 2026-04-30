import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, message, description }: EmptyStateProps) {
  return (
    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
      <Icon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <h3 className="text-white font-bold">{message}</h3>
      {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
    </div>
  );
}
