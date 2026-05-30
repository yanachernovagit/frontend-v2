"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserEvaluation, UserPlan } from "@/types";
import { EvaluationCard } from "./EvaluationCard";
import { SkeletonEvaluationList } from "./SkeletonEvaluationList";

type FilterType = "pre" | "post";

type Props = {
  evaluations?: {
    pre_plan: UserEvaluation[];
    post_plan: UserEvaluation[];
  } | null;
  loading?: boolean;
  showAll?: boolean;
  hideInstructions?: boolean;
  hideResults?: boolean;
  userPlan?: UserPlan | null;
  filter?: FilterType;
  onFilterChange?: (filter: FilterType) => void;
  onSelectEvaluation?: (evaluation: UserEvaluation) => void;
  selectedEvaluationId?: string;
  isPostPlanLocked?: boolean;
};

export function EvaluationsList({
  evaluations,
  loading,
  showAll = false,
  hideResults = false,
  userPlan,
  filter,
  onFilterChange,
  onSelectEvaluation,
  selectedEvaluationId,
  isPostPlanLocked = false,
}: Props) {
  const [internalFilter, setInternalFilter] = useState<FilterType>("pre");
  const resolvedFilter = filter ?? internalFilter;

  const resolvedEvaluations = evaluations ?? null;
  const resolvedLoading = Boolean(loading);
  const resolvedUserPlan = userPlan;

  const filteredEvaluations = useMemo(() => {
    if (!resolvedEvaluations) return [];

    const allEvaluations =
      resolvedFilter === "pre"
        ? resolvedEvaluations.pre_plan
        : resolvedEvaluations.post_plan;

    return showAll ? allEvaluations : allEvaluations.filter((e) => e.completed);
  }, [resolvedEvaluations, showAll, resolvedFilter]);

  return (
    <Card className="bg-bg-secondary rounded-xl h-full flex flex-col gap-1 p-2">
      <div className="flex gap-2">
        <Button
          variant={resolvedFilter === "pre" ? "default" : "outline_magent"}
          onClick={() => {
            setInternalFilter("pre");
            onFilterChange?.("pre");
          }}
          className="flex-1"
        >
          Antes del plan
        </Button>
        <Button
          variant={resolvedFilter === "post" ? "default" : "outline_magent"}
          onClick={() => {
            setInternalFilter("post");
            onFilterChange?.("post");
          }}
          className="flex-1"
        >
          Después del plan
        </Button>
      </div>
      {resolvedLoading ? (
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
            className={`space-y-3 overflow-y-auto h-full py-2 transition-all no-scrollbar ${
              isPostPlanLocked ? "blur-sm pointer-events-none" : ""
            }`}
          >
            {filteredEvaluations.map((evalItem) => (
              <EvaluationCard
                key={evalItem.evaluation.id}
                evaluation={evalItem}
                onPress={() => onSelectEvaluation?.(evalItem)}
                isSelected={selectedEvaluationId === evalItem.evaluation.id}
                hideResults={hideResults}
              />
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
                  evaluaciones después del plan
                </p>
                <p className="text-xs text-purple font-semibold mt-3">
                  Semana {resolvedUserPlan?.currentWeek} de{" "}
                  {resolvedUserPlan?.totalWeeks}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
