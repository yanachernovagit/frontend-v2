import { SkeletonLoader } from "@/components/shared";
import { Card } from "@/components/ui/card";

export function SkeletonEvaluationCard() {
  return (
    <Card className="rounded-xl p-4 bg-white border border-gray-200">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <SkeletonLoader width={48} height={48} />
        </div>
        <div className="flex-1 space-y-2">
          <SkeletonLoader width="70%" height={16} />
          <SkeletonLoader width="90%" height={12} />
          <SkeletonLoader width="60%" height={12} />
        </div>
      </div>
    </Card>
  );
}
