import { useCallback, useEffect, useState } from "react";

import { ExerciseCatalog } from "@/types";
import {
  createAdminExercise,
  deleteAdminExercise,
  getAdminExercises,
  updateAdminExercise,
} from "@/services/adminExercisesService";

export function useAdminExercises() {
  const [exercises, setExercises] = useState<ExerciseCatalog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminExercises();
      setExercises(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar ejercicios",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const createExercise = async (data: Omit<ExerciseCatalog, "id">) => {
    const created = await createAdminExercise(data);
    setExercises((prev) =>
      [...prev, created].sort((a, b) => a.name.localeCompare(b.name)),
    );
    return created;
  };

  const updateExercise = async (id: string, data: Partial<ExerciseCatalog>) => {
    const updated = await updateAdminExercise(id, data);
    setExercises((prev) =>
      prev
        .map((item) => (item.id === id ? updated : item))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
    return updated;
  };

  const deleteExercise = async (id: string) => {
    await deleteAdminExercise(id);
    setExercises((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise,
  };
}
