"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserEvaluation } from "@/types";
import { EvaluationCard } from "./EvaluationCard";
import { SkeletonEvaluationList } from "./SkeletonEvaluationList";
import { useUserPlan } from "@/hooks/useUserPlan";

type FilterType = "pre" | "post";

type Props = {
  evaluations?: {
    pre_plan: UserEvaluation[];
    post_plan: UserEvaluation[];
  } | null;
  loading?: boolean;
  showAll?: boolean;
  onSelectEvaluation?: (evaluation: UserEvaluation) => void;
  selectedEvaluationId?: string;
};

export function EvaluationsList({
  evaluations,
  loading = false,
  showAll = false,
  onSelectEvaluation,
  selectedEvaluationId,
}: Props) {
  const [filter, setFilter] = useState<FilterType>("pre");
  const { userPlan } = useUserPlan();

  const filteredEvaluations = useMemo(() => {
    if (!evaluations) return [];

    const allEvaluations =
      filter === "pre" ? evaluations.pre_plan : evaluations.post_plan;

    return showAll ? allEvaluations : allEvaluations.filter((e) => e.completed);
  }, [evaluations, showAll, filter]);

  const isPostPlanLocked =
    filter === "post" &&
    userPlan &&
    userPlan.currentWeek <= userPlan.totalWeeks;

  return (
    <Card className="bg-bg-secondary rounded-xl h-full flex flex-col gap-1 p-2">
      <div className="flex gap-2">
        <Button
          variant={filter === "pre" ? "default" : "outline_magent"}
          onClick={() => setFilter("pre")}
          className="flex-1"
        >
          Pre-cirugía
        </Button>
        <Button
          variant={filter === "post" ? "default" : "outline_magent"}
          onClick={() => setFilter("post")}
          className="flex-1"
        >
          Post-cirugía
        </Button>
      </div>
      {loading ? (
        <SkeletonEvaluationList count={3} />
      ) : filteredEvaluations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            {showAll
              ? "No hay evaluaciones"
              : "No hay evaluaciones completadas"}
          </p>
        </div>
      ) : (
        <div className="relative flex-1 min-h-0">
          <div
            className={`space-y-3 overflow-y-auto h-full py-2 transition-all ${
              isPostPlanLocked ? "blur-sm pointer-events-none" : ""
            }`}
          >
            {filteredEvaluations.map((evalItem) => (
              <div
                key={evalItem.evaluation.id}
                className={`transition-all ring rounded-2xl ${
                  selectedEvaluationId === evalItem.evaluation.id
                    ? "ring-purple"
                    : "ring-transparent"
                }`}
              >
                <EvaluationCard
                  evaluation={evalItem}
                  onPress={() => onSelectEvaluation?.(evalItem)}
                />
              </div>
            ))}
          </div>
          {isPostPlanLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary/30">
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm mx-4 text-center">
                <p className="text-lg font-bold text-gray-900 mb-2">
                  Evaluaciones bloqueadas
                </p>
                <p className="text-sm text-gray-600">
                  Completa tu plan de tratamiento para desbloquear las
                  evaluaciones post-cirugía
                </p>
                <p className="text-xs text-purple font-semibold mt-3">
                  Semana {userPlan?.currentWeek} de {userPlan?.totalWeeks}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
