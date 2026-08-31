import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

export function ArticleCardSkeleton({
  variant = "default",
}: {
  variant?: string;
}) {
  if (variant === "compact") {
    return (
      <div className="flex items-start gap-3">
        <Skeleton className="w-20 h-16 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return <Skeleton className="aspect-[16/9] rounded-xl" />;
  }

  return (
    <div className="card">
      <Skeleton className="aspect-[16/10]" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <Skeleton className="aspect-[16/9] rounded-xl" />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Skeleton className="aspect-[16/9] rounded-xl" />
        <Skeleton className="aspect-[16/9] rounded-xl" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="card">
      <Skeleton className="h-48" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton };
