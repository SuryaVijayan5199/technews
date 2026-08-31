import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number; // 0-10
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  size = "md",
  showValue = true,
  className,
}: RatingStarsProps) {
  const stars = (rating / 10) * 5; // convert 0-10 to 0-5
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const iconSize =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const textSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(iconSize, "star-fill")}
            fill="currentColor"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(iconSize, "star-empty")} fill="currentColor" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(iconSize, "star-fill")} fill="currentColor" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(iconSize, "star-empty")}
            fill="currentColor"
          />
        ))}
      </div>
      {showValue && (
        <span
          className={cn(textSize, "font-bold text-[var(--color-text-primary)]")}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function RatingBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const pct = (value / 10) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className="font-bold text-[var(--color-text-primary)]">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="h-1.5 bg-[var(--color-surface-3)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background:
              value >= 8
                ? "var(--color-accent-green)"
                : value >= 6
                ? "var(--color-brand-500)"
                : "var(--color-accent-orange)",
          }}
        />
      </div>
    </div>
  );
}
