import { useCallback, useEffect, useState } from "react";
import { getDailyStepsService } from "@/services/stepsService";
import { UserStep } from "@/types";

const DEFAULT_PERIOD_DAYS = 14;

interface UseStepsHistoryReturn {
  steps: UserStep[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStepsHistory = (
  periodDays = DEFAULT_PERIOD_DAYS,
): UseStepsHistoryReturn => {
  const [steps, setSteps] = useState<UserStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const backendData = await getDailyStepsService(periodDays);
      const sorted = backendData.sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      );
      setSteps(sorted);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  return {
    steps,
    loading,
    error,
    refetch: fetchSteps,
  };
};
