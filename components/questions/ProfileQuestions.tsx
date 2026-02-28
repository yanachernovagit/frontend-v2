"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { useProfileQuestions } from "@/hooks/useProfileQuestions";
import { Button } from "@/components/ui/button";
import { PROFILE_QUESTIONS_STEPS } from "@/constants/ProfileQuestionsSteps";

import { SkeletonProfileQuestions } from "./SkeletonProfileQuestions";
import { QuestionRenderer } from "./QuestionRenderer";

type Props = {
  updateTasks: () => void;
  onComplete?: () => void;
};

export function ProfileQuestions({ updateTasks, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [pendingAdvanceFrom, setPendingAdvanceFrom] = useState<string | null>(
    null,
  );
  const questionsScrollRef = useRef<HTMLDivElement | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const {
    questions,
    loading,
    error,
    refetch,
    updateAnswer,
    getAnswer,
    canDisplay,
    submitAllAnswers,
  } = useProfileQuestions();

  const visibleQuestions = useMemo(() => {
    return questions
      .filter((q) => q.isActive && q.step === step)
      .sort((a, b) => a.order - b.order)
      .filter((q) => canDisplay(q));
  }, [canDisplay, questions, step]);

  const maxStep = useMemo(() => {
    const activeSteps = questions
      .filter((q) => q.isActive)
      .map((q) => q.step || 0);
    return activeSteps.length ? Math.max(...activeSteps) : 1;
  }, [questions]);

  const isLastStep = step >= maxStep;

  const canProceed = useMemo(() => {
    const requiredQuestions = visibleQuestions.filter((q) => q.isRequired);
    return requiredQuestions.every((q) => {
      const answer = getAnswer(q.id);
      return answer && answer.trim().length > 0;
    });
  }, [getAnswer, visibleQuestions]);

  useEffect(() => {
    if (!questionsScrollRef.current) return;
    questionsScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (!pendingAdvanceFrom) return;

    const currentIndex = visibleQuestions.findIndex(
      (q) => q.id === pendingAdvanceFrom,
    );
    if (currentIndex < 0) {
      setPendingAdvanceFrom(null);
      return;
    }

    const nextQuestion = visibleQuestions[currentIndex + 1];
    if (!nextQuestion) {
      setPendingAdvanceFrom(null);
      return;
    }

    const nextNode = questionRefs.current[nextQuestion.id];
    if (nextNode) {
      nextNode.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setPendingAdvanceFrom(null);
  }, [pendingAdvanceFrom, visibleQuestions]);

  const handleNext = () => {
    if (!canProceed) {
      setFormError("Por favor completa todos los campos requeridos");
      return;
    }

    setFormError(null);
    setDirection("forward");
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setFormError(null);
      setDirection("backward");
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed) {
      setFormError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      const res = await submitAllAnswers();

      if (res.success) {
        updateTasks();
        onComplete?.();
        return;
      }

      setFormError(res.error || "Error al guardar las respuestas");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error al guardar";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswered = (questionId: string) => {
    setPendingAdvanceFrom(questionId);
  };

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-x-hidden bg-white">
      <div className="mb-4 flex shrink-0 min-w-0 items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-magent">
          Completa tu perfil
        </h2>
        <p className="text-sm text-gray-600">
          {step}/{maxStep}
        </p>
      </div>

      <div className="mb-6 shrink-0">
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxStep }, (_, i) => i + 1).map((stepNum) => (
            <div
              key={stepNum}
              className={`h-1.5 flex-1 rounded-full ${
                stepNum <= step ? "bg-magent" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 overflow-y-auto">
          <SkeletonProfileQuestions />
        </div>
      ) : error ? (
        <div className="flex-1 overflow-y-auto py-6">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="mt-2 text-sm text-blue-600 underline"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div
            ref={questionsScrollRef}
            className="no-scrollbar flex-1 overflow-y-auto pr-1"
          >
            <div
              key={step}
              className={`animate-in fade-in-0 duration-300 ${
                direction === "forward"
                  ? "slide-in-from-right-4"
                  : "slide-in-from-left-4"
              }`}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-full bg-magent px-3 py-1">
                  <p className="text-sm font-bold text-white">Paso {step}</p>
                </div>
                <p className="flex-1 text-base font-medium text-gray-700">
                  {PROFILE_QUESTIONS_STEPS[
                    step as keyof typeof PROFILE_QUESTIONS_STEPS
                  ] || "Preguntas"}
                </p>
              </div>

              {visibleQuestions.map((question) => (
                <div
                  key={question.id}
                  ref={(node) => {
                    questionRefs.current[question.id] = node;
                  }}
                >
                  <QuestionRenderer
                    question={question}
                    value={getAnswer(question.id)}
                    onValueChange={updateAnswer}
                    onAnswered={handleAnswered}
                  />
                </div>
              ))}
            </div>
          </div>

          {formError ? (
            <div className="mb-4 mt-4 shrink-0 rounded-xl bg-red-50 p-3">
              <p className="text-sm font-medium text-red-600">{formError}</p>
            </div>
          ) : null}

          <div className="mt-4 flex w-full shrink-0 gap-3 pb-2">
            {step > 1 ? (
              <Button
                type="button"
                onClick={handleBack}
                variant="outline_magent"
                className="min-h-[52px] min-w-0 flex-1 rounded-full"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Atras
              </Button>
            ) : null}

            {!isLastStep ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="min-h-[52px] min-w-0 flex-1"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed || submitting}
                className="min-h-[52px] min-w-0 flex-1 bg-magent text-white hover:bg-magent/90"
              >
                {submitting ? "Guardando..." : "Completar perfil"}
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
