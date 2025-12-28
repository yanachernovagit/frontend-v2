"use client";

import { useState } from "react";
import {
  EvaluationsList,
  EvaluationDetailCard,
} from "@/components/evaluations";
import { UserEvaluation } from "@/types";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEvaluations } from "@/hooks/useEvaluations";

export default function EvaluationsPage() {
  const { user } = useAuth();
  const { completeEvaluation } = useEvaluations(user?.sub);
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<UserEvaluation | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCompleteEvaluation = async (results: Record<string, string>) => {
    if (!selectedEvaluation || !user?.sub) return;

    setIsUpdating(true);
    try {
      await completeEvaluation({
        userId: user.sub,
        evaluationId: selectedEvaluation.evaluation.id,
        results,
      });

      alert("Evaluación completada exitosamente");
      setSelectedEvaluation(null);
    } catch (error) {
      alert("Error al completar la evaluación");
      console.error("Error completing evaluation:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex w-full h-full gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 w-[45%] h-full min-w-0">
        <EvaluationsList
          showAll
          onSelectEvaluation={setSelectedEvaluation}
          selectedEvaluationId={selectedEvaluation?.evaluation.id}
        />
      </div>
      <div className="w-[55%] h-full min-w-0">
        {selectedEvaluation ? (
          <Card className="bg-bg-secondary rounded-xl h-full p-4">
            <EvaluationDetailCard
              evaluation={selectedEvaluation.evaluation}
              onComplete={handleCompleteEvaluation}
              isUpdating={isUpdating}
            />
          </Card>
        ) : (
          <Card className="bg-bg-secondary rounded-xl h-full flex items-center justify-center">
            <p className="text-gray-500 text-sm">
              Selecciona una evaluación para ver los detalles
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
