import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
}

export function Rating({ value, count, size = "sm" }: RatingProps) {
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 text-yellow-500">
        <Star className={`${iconSize} fill-current`} />
        <span className={`font-semibold ${textSize} text-[rgb(var(--text))]`}>
          {value.toFixed(1)}
        </span>
      </div>
      {count !== undefined && (
        <span className={`${textSize} text-[rgb(var(--text-muted))]`}>
          ({count})
        </span>
      )}
    </div>
  );
}
