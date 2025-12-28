import { SkeletonEvaluationCard } from "./SkeletonEvaluationCard";

type Props = {
  count?: number;
};

export function SkeletonEvaluationList({ count = 4 }: Props) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonEvaluationCard key={index} />
      ))}
    </div>
  );
}
