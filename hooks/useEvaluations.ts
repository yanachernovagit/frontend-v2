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
import { set } from "zod";

interface UseUserPlanReturn {
  evaluations: GroupedUserEvaluations | null;
  loading: boolean;
  error: string | null;
  completeEvaluation: (
    data: CompleteEvaluationDto,
  ) => Promise<CompletedUserEvaluation>;
  refetch: () => Promise<void>;
}

export const useEvaluations = (): UseUserPlanReturn => {
  const [evaluations, setEvaluations] = useState<GroupedUserEvaluations | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const _evaluations = await getUserEvaluationsService();
      setEvaluations(_evaluations);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const completeEvaluation = useCallback(
    async (data: CompleteEvaluationDto): Promise<CompletedUserEvaluation> => {
      try {
        setError(null);
        setLoading(true);
        const result = await completeUserEvaluationService(data);
        await fetchEvaluations();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        throw err instanceof Error ? err : new Error(errorMessage);
      } finally {
        setLoading(false);
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
