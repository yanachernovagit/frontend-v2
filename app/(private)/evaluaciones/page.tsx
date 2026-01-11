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
    } catch (error) {}
  };

  const handleSelectEvaluation = (evaluation: UserEvaluation | null) => {
    setSelectedEvaluation(evaluation);
    setCompletedResults(null);
  };

  return (
    <div className="flex w-full h-full gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 w-[45%] h-full min-w-0">
        <EvaluationsList
          evaluations={evaluations}
          loading={loading}
          showAll
          onSelectEvaluation={handleSelectEvaluation}
          selectedEvaluationId={selectedEvaluation?.evaluation.id}
        />
      </div>
      {completedResults && selectedEvaluation ? (
        <CompletedEvaluationView
          results={completedResults}
          evaluation={selectedEvaluation?.evaluation}
        />
      ) : (
        <div className="w-[55%] h-full min-w-0">
          {selectedEvaluation ? (
            <div className="h-full">
              {selectedEvaluation.evaluation.type ===
              EvaluationTypeEnum.TIME ? (
                <TimeEvaluation
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
      )}
    </div>
  );
}
