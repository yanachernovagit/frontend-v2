import { useCallback, useEffect, useState } from "react";

import { RoutineVariation, CreateRoutineVariationPayload } from "@/types";
import {
  createAdminRoutineVariation,
  deleteAdminRoutineVariation,
  getAdminRoutineVariations,
  updateAdminRoutineVariation,
} from "@/services/adminRoutineVariationsService";

export function useAdminRoutineVariations() {
  const [variations, setVariations] = useState<RoutineVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminRoutineVariations();
      setVariations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar variaciones de rutina",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVariations();
  }, [fetchVariations]);

  const createVariation = async (data: CreateRoutineVariationPayload) => {
    const created = await createAdminRoutineVariation(data);
    setVariations((prev) => [...prev, created]);
    return created;
  };

  const updateVariation = async (
    id: string,
    data: CreateRoutineVariationPayload,
  ) => {
    const updated = await updateAdminRoutineVariation(id, data);
    setVariations((prev) =>
      prev.map((item) => (item.id === id ? updated : item)),
    );
    return updated;
  };

  const deleteVariation = async (id: string) => {
    await deleteAdminRoutineVariation(id);
    setVariations((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    variations,
    loading,
    error,
    refetch: fetchVariations,
    createVariation,
    updateVariation,
    deleteVariation,
  };
}
