"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEvaluations } from "@/hooks/useEvaluations";
import { UserEvaluation } from "@/types";
import { EvaluationCard } from "./EvaluationCard";
import { SkeletonEvaluationList } from "./SkeletonEvaluationList";

type FilterType = "pre" | "post";

type Props = {
  hideInstructions?: boolean;
  showAll?: boolean;
  onSelectEvaluation?: (evaluation: UserEvaluation) => void;
  selectedEvaluationId?: string;
};

export function EvaluationsList({
  hideInstructions = false,
  showAll = false,
  onSelectEvaluation,
  selectedEvaluationId,
}: Props) {
  const { user } = useAuth();
  const { evaluations, loading } = useEvaluations(user?.sub);
  const [filter, setFilter] = useState<FilterType>("pre");

  const filteredEvaluations = useMemo(() => {
    if (!evaluations) return [];

    const allEvaluations =
      filter === "pre" ? evaluations.pre_plan : evaluations.post_plan;

    return showAll ? allEvaluations : allEvaluations.filter((e) => e.completed);
  }, [evaluations, showAll, filter]);

  return (
    <Card className="bg-bg-secondary rounded-xl h-full flex flex-col gap-1 pt-0">
      <div className="flex gap-2 pt-2 px-2">
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
        <div className="space-y-3 overflow-y-auto flex-1 min-h-0 p-2">
          {filteredEvaluations.map((evalItem) => (
            <div
              key={evalItem.evaluation.id}
              className={`transition-all ${
                selectedEvaluationId === evalItem.evaluation.id
                  ? "ring-1 ring-purple rounded-xl"
                  : ""
              }`}
            >
              <EvaluationCard
                evaluation={evalItem}
                hideInstructions={hideInstructions}
                onPress={() => onSelectEvaluation?.(evalItem)}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
