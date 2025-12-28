import { SkeletonTaskCard } from "./SkeletonTaskCard";

export function SkeletonTaskList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTaskCard key={i} />
      ))}
    </div>
  );
}
