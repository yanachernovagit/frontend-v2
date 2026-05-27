import { useState, useEffect, useCallback, useRef } from "react";
import type { UserTasksStatus } from "@/types";
import { getUserTasksService } from "@/services/userTasksService";

interface UseUserTasksReturn {
  userTasks: UserTasksStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserTasks = (): UseUserTasksReturn => {
  const [userTasks, setUserTasks] = useState<UserTasksStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchUserTasks = useCallback(async () => {
    if (!hasFetched.current) setLoading(true);
    setError(null);

    try {
      const tasks = await getUserTasksService();
      setUserTasks(tasks);
      hasFetched.current = true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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
