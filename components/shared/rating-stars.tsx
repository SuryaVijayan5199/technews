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
    <div className={cn("tc-rating", className)}>
      <div className="tc-rating__stars">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(iconSize, "star-fill")}
            fill="currentColor"
          />
        ))}
        {hasHalfStar && (
          <div className="tc-rating__star">
            <Star className={cn(iconSize, "star-empty")} fill="currentColor" />
            <div className="tc-rating__half">
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
          className={cn(textSize, "font-bold tc-rating__score")}
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
    <div className="tc-rating__breakdown">
      <div className="tc-rating__breakdown-row">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className="font-bold text-[var(--color-text-primary)]">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="tc-rating__bar-track">
        <div
          className="tc-rating__bar-fill"
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
