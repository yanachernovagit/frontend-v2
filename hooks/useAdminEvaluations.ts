import { useCallback, useEffect, useState } from "react";

import { Evaluation } from "@/types";
import {
  createAdminEvaluation,
  deleteAdminEvaluation,
  getAdminEvaluations,
  updateAdminEvaluation,
} from "@/services/adminEvaluationsService";

export function useAdminEvaluations() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminEvaluations();
      setEvaluations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar evaluaciones",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const createEvaluation = async (
    data: Omit<Evaluation, "id" | "createdAt" | "updatedAt">,
  ) => {
    const created = await createAdminEvaluation(data);
    setEvaluations((prev) =>
      [...prev, created].sort((a, b) => a.order - b.order),
    );
    return created;
  };

  const updateEvaluation = async (id: string, data: Partial<Evaluation>) => {
    const updated = await updateAdminEvaluation(id, data);
    setEvaluations((prev) =>
      prev
        .map((item) => (item.id === id ? updated : item))
        .sort((a, b) => a.order - b.order),
    );
    return updated;
  };

  const deleteEvaluation = async (id: string) => {
    await deleteAdminEvaluation(id);
    setEvaluations((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    evaluations,
    loading,
    error,
    refetch: fetchEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
  };
}
