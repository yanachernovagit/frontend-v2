import { useCallback, useEffect, useState } from "react";

import { ProfileQuestion } from "@/types";
import {
  createAdminQuestion,
  deleteAdminQuestion,
  getAdminQuestions,
  updateAdminQuestion,
} from "@/services/adminQuestionsService";

export function useAdminQuestions() {
  const [questions, setQuestions] = useState<ProfileQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminQuestions();
      setQuestions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar preguntas",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const createQuestion = async (data: Partial<ProfileQuestion>) => {
    const created = await createAdminQuestion(data);
    setQuestions((prev) =>
      [...prev, created].sort((a, b) => a.order - b.order),
    );
    return created;
  };

  const updateQuestion = async (id: string, data: Partial<ProfileQuestion>) => {
    const updated = await updateAdminQuestion(id, data);
    setQuestions((prev) =>
      prev
        .map((item) => (item.id === id ? updated : item))
        .sort((a, b) => a.order - b.order),
    );
    return updated;
  };

  const deleteQuestion = async (id: string) => {
    await deleteAdminQuestion(id);
    setQuestions((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
