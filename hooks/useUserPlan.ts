import { useState, useEffect, useCallback } from "react";
import type { UserPlan } from "@/types";
import {
  getUserPlanService,
  updateUserPlanProgressService,
} from "@/services/userPlanService";

interface UseUserPlanReturn {
  userPlan: UserPlan | null;
  updatePlanProgress: () => void;
  changedRoutine: boolean;
  viewNextRoutine: () => void;
  loading: boolean;
  updatingProgress: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserPlan = (): UseUserPlanReturn => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [changedRoutine, setChangedRoutine] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPlan = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const plan = await getUserPlanService();
      setUserPlan(plan);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlanProgress = async () => {
    setUpdatingProgress(true);
    try {
      const plan = await updateUserPlanProgressService();
      if (plan.progressRoutine !== userPlan?.progressRoutine) {
        setChangedRoutine(true);
      }
      setUserPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          progressRoutine: plan.progressRoutine ?? prev.progressRoutine,
          progressExercise: plan.progressExercise ?? prev.progressExercise,
          completedToday: plan.completedToday ?? prev.completedToday,
        };
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const viewNextRoutine = () => {
    setChangedRoutine(false);
  };

  useEffect(() => {
    fetchUserPlan();
  }, [fetchUserPlan]);

  return {
    userPlan,
    updatePlanProgress,
    changedRoutine,
    viewNextRoutine,
    loading,
    updatingProgress,
    error,
    refetch: fetchUserPlan,
  };
};
