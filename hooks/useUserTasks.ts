import { useState, useEffect, useCallback } from "react";
import type { UserTasksStatus } from "@/types";
import { getUserTasksService } from "@/services/userTasksService";

interface UseUserTasksReturn {
  userTasks: UserTasksStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserTasks = (userId?: string): UseUserTasksReturn => {
  const [userTasks, setUserTasks] = useState<UserTasksStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTasks = useCallback(async () => {
    if (!userId) {
      setUserTasks(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tasks = await getUserTasksService();
      setUserTasks(tasks);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setUserTasks(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserTasks();
  }, [fetchUserTasks]);

  return {
    userTasks,
    loading,
    error,
    refetch: fetchUserTasks,
  };
};
