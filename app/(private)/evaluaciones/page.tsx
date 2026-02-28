"use client";

import { useState } from "react";
import {
  EvaluationsList,
  TimeEvaluation,
  RangeOfMotionEvaluation,
  ArmMeasurementEvaluation,
  CompletedEvaluationView,
} from "@/components/evaluations";
import { CompletedUserEvaluation, UserEvaluation } from "@/types";
import { Card } from "@/components/ui/card";
import { useEvaluations } from "@/hooks/useEvaluations";
import { useUserPlan } from "@/hooks/useUserPlan";
import { EvaluationTypeEnum, PhaseEnum } from "@/constants/enums";

export default function EvaluationsPage() {
  const { userPlan } = useUserPlan();
  const { evaluations, loading, completeEvaluation, refetch } =
    useEvaluations();
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<
    "pre" | "post"
  >("pre");
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<UserEvaluation | null>(null);

  const [completedResults, setCompletedResults] =
    useState<CompletedUserEvaluation | null>(null);

  const handleCompleteEvaluation = async (results: Record<string, string>) => {
    if (!selectedEvaluation) return;

    try {
      const completedData = await completeEvaluation({
        evaluationId: selectedEvaluation.evaluation.id,
        phase: userPlan?.phase as PhaseEnum,
        results,
      });
      setCompletedResults(completedData);
      await refetch();
    } catch {}
  };

  const handleSelectEvaluation = (evaluation: UserEvaluation | null) => {
    setSelectedEvaluation(evaluation);
    setCompletedResults(null);
  };

  const currentPhaseEvaluations =
    selectedPhaseFilter === "pre"
      ? (evaluations?.pre_plan ?? [])
      : (evaluations?.post_plan ?? []);

  const allCurrentPhaseCompleted =
    currentPhaseEvaluations.length > 0 &&
    currentPhaseEvaluations.every((item) => item.completed);

  return (
    <div className="flex w-full h-full gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 w-[45%] h-full min-w-0">
        <EvaluationsList
          evaluations={evaluations}
          loading={loading}
          userPlan={userPlan}
          filter={selectedPhaseFilter}
          onFilterChange={setSelectedPhaseFilter}
          showAll
          onSelectEvaluation={handleSelectEvaluation}
          selectedEvaluationId={selectedEvaluation?.evaluation.id}
        />
      </div>
      <div className="w-[55%] h-full min-w-0 flex flex-col gap-3">
        {allCurrentPhaseCompleted ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-3">
            <p className="text-sm font-medium text-green-700">
              Ya terminaste todos los test de esta etapa. Ahora puedes comenzar
              con los ejercicios del plan.
            </p>
          </div>
        ) : null}
        <div className="flex-1 min-h-0">
          {completedResults && selectedEvaluation ? (
            <CompletedEvaluationView
              results={completedResults}
              evaluation={selectedEvaluation?.evaluation}
            />
          ) : selectedEvaluation ? (
            <div className="h-full">
              {selectedEvaluation.evaluation.type ===
              EvaluationTypeEnum.TIME ? (
                <TimeEvaluation
                  key={selectedEvaluation.evaluation.id}
                  evaluation={selectedEvaluation.evaluation}
                  onComplete={handleCompleteEvaluation}
                  completedResults={selectedEvaluation.results}
                />
              ) : selectedEvaluation.evaluation.type ===
                EvaluationTypeEnum.MOVEMENT_RANGE ? (
                <RangeOfMotionEvaluation
                  evaluation={selectedEvaluation.evaluation}
                  onComplete={handleCompleteEvaluation}
                  completedResults={selectedEvaluation.results}
                />
              ) : (
                <ArmMeasurementEvaluation
                  evaluation={selectedEvaluation.evaluation}
                  onComplete={handleCompleteEvaluation}
                  completedResults={selectedEvaluation.results}
                />
              )}
            </div>
          ) : (
            <Card className="bg-bg-secondary rounded-xl h-full flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                Selecciona una evaluación para ver los detalles
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
