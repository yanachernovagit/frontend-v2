import {
  completeUserEvaluationService,
  getUserEvaluationsService,
} from "@/services/evaluationService";
import type {
  CompletedUserEvaluation,
  CompleteEvaluationDto,
  GroupedUserEvaluations,
} from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseUserPlanReturn {
  evaluations: GroupedUserEvaluations | null;
  loading: boolean;
  error: string | null;
  completeEvaluation: (
    data: CompleteEvaluationDto,
  ) => Promise<CompletedUserEvaluation>;
  refetch: () => Promise<void>;
}

export const useEvaluations = (userId?: string): UseUserPlanReturn => {
  const [evaluations, setEvaluations] = useState<GroupedUserEvaluations | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const _evaluations = await getUserEvaluationsService(userId);
      setEvaluations(_evaluations);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchEvaluations();
    }
  }, [userId, fetchEvaluations]);

  const completeEvaluation = useCallback(
    async (data: CompleteEvaluationDto): Promise<CompletedUserEvaluation> => {
      try {
        setError(null);
        const result = await completeUserEvaluationService(data);
        await fetchEvaluations();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        throw err instanceof Error ? err : new Error(errorMessage);
      }
    },
    [fetchEvaluations],
  );

  return {
    evaluations,
    loading,
    error,
    completeEvaluation,
    refetch: fetchEvaluations,
  };
};
