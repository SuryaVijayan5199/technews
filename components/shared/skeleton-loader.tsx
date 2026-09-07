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
      <div className="tc-skel-compact">
        <Skeleton className="tc-skel-thumb" />
        <div className="tc-skel-compact__body">
          <Skeleton style={{ height: "0.75rem", width: "4rem" }} />
          <Skeleton style={{ height: "1rem", width: "100%" }} />
          <Skeleton style={{ height: "0.75rem", width: "75%" }} />
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return <Skeleton className="tc-skel-media" />;
  }

  return (
    <div className="card">
      <Skeleton className="tc-skel-media--wide" />
      <div className="p-4 space-y-3">
        <Skeleton style={{ height: "1rem", width: "4rem" }} />
        <Skeleton style={{ height: "1.25rem", width: "100%" }} />
        <Skeleton style={{ height: "1.25rem", width: "80%" }} />
        <div className="flex items-center justify-between pt-2">
          <Skeleton style={{ height: "0.75rem", width: "6rem" }} />
          <Skeleton style={{ height: "0.75rem", width: "4rem" }} />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <Skeleton className="tc-skel-media" />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Skeleton className="tc-skel-media" />
        <Skeleton className="tc-skel-media" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="card">
      <Skeleton className="tc-skel-card-img" />
      <div className="p-5 space-y-3">
        <Skeleton style={{ height: "1.25rem", width: "75%" }} />
        <Skeleton style={{ height: "1rem", width: "100%" }} />
        <Skeleton style={{ height: "2rem", width: "8rem" }} />
        <div className="space-y-2">
          <Skeleton style={{ height: "0.75rem", width: "100%" }} />
          <Skeleton style={{ height: "0.75rem", width: "80%" }} />
          <Skeleton style={{ height: "0.75rem", width: "60%" }} />
        </div>
      </div>
    </div>
  );
}

export { Skeleton };
