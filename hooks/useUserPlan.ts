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

export const useUserPlan = (userId?: string): UseUserPlanReturn => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [changedRoutine, setChangedRoutine] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPlan = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const plan = await getUserPlanService(userId);
      setUserPlan(plan);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updatePlanProgress = async () => {
    if (!userId) return;
    setUpdatingProgress(true);
    try {
      const plan = await updateUserPlanProgressService(userId);
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
    if (userId) {
      fetchUserPlan();
    }
  }, [userId, fetchUserPlan]);

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
