import { useCallback, useEffect, useState } from "react";
import type { ProfileQuestion, ProfileQuestionAnswer } from "@/types";
import { getProfileService } from "@/services/profileQuestionsService";
import { saveAllProfileAnswersService } from "@/services/profileAnswersService";
import { useAuth } from "./useAuth";

interface UseProfileQuestionsReturn {
  questions: ProfileQuestion[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  // answers logic
  answers: ProfileQuestionAnswer[];
  updateAnswer: (questionId: string, value: string) => void;
  getAnswer: (questionId: string) => string;
  canDisplay: (q: ProfileQuestion) => boolean;
  submitAllAnswers: () => Promise<{
    success: boolean;
    total: number;
    error?: string;
  }>;
}

export const useProfileQuestions = (): UseProfileQuestionsReturn => {
  const [questions, setQuestions] = useState<ProfileQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<ProfileQuestionAnswer[]>([]);

  const { user } = useAuth();

  const storageKey = user?.sub ? `profile_answers_${user.sub}` : null;

  const setStoredAnswers = useCallback(
    (nextAnswers: ProfileQuestionAnswer[]) => {
      if (!storageKey || typeof window === "undefined") return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextAnswers));
      } catch {
        // Ignore storage errors to avoid blocking question flow.
      }
    },
    [storageKey],
  );

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfileService();
      setQuestions(data);
      setAnswers([]);
      if (storageKey && typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const updateAnswer = (questionId: string, answer: string) => {
    const currentUserId = user?.sub;
    if (!currentUserId) return;
    setAnswers((prev) => {
      const updated = prev.filter((a) => a.questionId !== questionId);
      updated.push({ questionId, answer, userId: currentUserId });
      setStoredAnswers(updated);
      return updated;
    });
  };

  const getAnswer = (questionId: string) => {
    return answers.find((a) => a.questionId === questionId)?.answer || "";
  };

  const canDisplay = (q: ProfileQuestion) => {
    if (!q.dependsOnQuestionId || !q.dependsOnValue) return true;
    const parentValue = getAnswer(q.dependsOnQuestionId);
    return parentValue === q.dependsOnValue;
  };

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
    answers,
    updateAnswer,
    getAnswer,
    canDisplay,
    submitAllAnswers: async () => {
      try {
        await saveAllProfileAnswersService(answers);
        if (storageKey && typeof window !== "undefined") {
          localStorage.removeItem(storageKey);
        }
        return {
          success: true,
          total: answers.length,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al guardar las respuestas";
        return {
          success: false,
          total: answers.length,
          error: errorMessage,
        };
      }
    },
  };
};
