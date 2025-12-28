import { SkeletonLoader } from "@/components/shared";
import { Card } from "@/components/ui/card";

export function SkeletonTaskCard() {
  return (
    <Card className="flex flex-row items-center p-4 rounded-2xl border border-gray-200">
      <div className="mr-3">
        <SkeletonLoader width={40} height={40} />
      </div>
      <div className="flex-1 space-y-2">
        <SkeletonLoader width={"70%"} height={16} />
        <SkeletonLoader width={"55%"} height={12} />
      </div>
    </Card>
  );
}
