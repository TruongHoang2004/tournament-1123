interface TeamAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function TeamAvatar({ name, size = "md", className = "" }: TeamAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs rounded-lg",
    md: "w-10 h-10 text-lg rounded-xl",
    lg: "w-14 h-14 text-2xl rounded-2xl",
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg ${className}`}>
      {name.charAt(0)}
    </div>
  );
}
