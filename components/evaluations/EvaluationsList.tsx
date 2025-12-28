"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEvaluations } from "@/hooks/useEvaluations";
import { EvaluationCard } from "./EvaluationCard";
import { SkeletonEvaluationList } from "./SkeletonEvaluationList";

type Props = {
  hideInstructions?: boolean;
};

export function EvaluationsList({ hideInstructions = false }: Props) {
  const { user } = useAuth();
  const { evaluations, loading } = useEvaluations(user?.sub);

  const completedEvaluations = useMemo(() => {
    if (!evaluations) return [];
    const allEvaluations = [...evaluations.pre_plan, ...evaluations.post_plan];
    return allEvaluations.filter((e) => e.completed);
  }, [evaluations]);

  return (
    <Card className="p-4 bg-bg-secondary rounded-xl mt-4 flex-1 min-h-0 flex flex-col gap-1">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">
          Evaluaciones Realizadas
        </h3>
      </div>
      {loading ? (
        <SkeletonEvaluationList count={3} />
      ) : completedEvaluations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            No hay evaluaciones completadas
          </p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto flex-1 min-h-0">
          {completedEvaluations.map((evalItem) => (
            <EvaluationCard
              key={evalItem.evaluation.id}
              evaluation={evalItem}
              hideInstructions={hideInstructions}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
