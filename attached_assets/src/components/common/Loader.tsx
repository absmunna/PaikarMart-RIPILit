interface LoaderProps {
  full?: boolean;
  label?: string;
}

export default function Loader({ full, label }: LoaderProps) {
  return (
    <div className={full ? "min-h-[60dvh] grid place-items-center" : "py-10 grid place-items-center"}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: "rgb(var(--primary))", borderRightColor: "rgb(var(--primary) / 0.4)" }}
        />
        {label && <p className="text-sm" style={{ color: "rgb(var(--text-subtle))" }}>{label}</p>}
      </div>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden flex flex-col">
      <div className="aspect-[4/5] skeleton rounded-none" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FeedPostSkeleton() {
  return (
    <div className="glass-card overflow-hidden flex flex-col">
      <div className="p-4 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-1/4" />
        </div>
      </div>
      <div className="px-4 pb-3 flex flex-col gap-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="p-4 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function FeedSkeletonList({ count = 2 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <FeedPostSkeleton key={i} />
      ))}
    </div>
  );
}
