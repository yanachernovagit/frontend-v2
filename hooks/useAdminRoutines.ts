import { useCallback, useEffect, useState } from "react";

import { RoutineCatalog } from "@/types";
import {
  createAdminRoutine,
  deleteAdminRoutine,
  getAdminRoutines,
  updateAdminRoutine,
} from "@/services/adminRoutinesService";

export function useAdminRoutines() {
  const [routines, setRoutines] = useState<RoutineCatalog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminRoutines();
      setRoutines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar rutinas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const createRoutine = async (data: Omit<RoutineCatalog, "id">) => {
    const created = await createAdminRoutine(data);
    setRoutines((prev) => [...prev, created].sort((a, b) => a.order - b.order));
    return created;
  };

  const updateRoutine = async (id: string, data: Partial<RoutineCatalog>) => {
    const updated = await updateAdminRoutine(id, data);
    setRoutines((prev) =>
      prev
        .map((item) => (item.id === id ? updated : item))
        .sort((a, b) => a.order - b.order),
    );
    return updated;
  };

  const deleteRoutine = async (id: string) => {
    await deleteAdminRoutine(id);
    setRoutines((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    routines,
    loading,
    error,
    refetch: fetchRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  };
}
