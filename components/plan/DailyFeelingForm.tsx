"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FatigueLevelEnum } from "@/constants/enums";
import {
  DailyFeelingValue,
  submitPlanFeelingService,
} from "@/services/planFeelingService";

const FEELING_OPTIONS: { label: string; value: DailyFeelingValue }[] = [
  { label: "Baja", value: FatigueLevelEnum.LOW },
  { label: "Media", value: FatigueLevelEnum.MEDIUM },
  { label: "Alta", value: FatigueLevelEnum.HIGH },
];

export function DailyFeelingForm() {
  const [selected, setSelected] = useState<DailyFeelingValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optionDescription: Record<DailyFeelingValue, string> = {
    [FatigueLevelEnum.LOW]: "Me siento bien, podría seguir",
    [FatigueLevelEnum.MEDIUM]: "Estoy algo cansado/a",
    [FatigueLevelEnum.HIGH]: "Estoy muy cansado/a",
  };

  const optionEmoji: Record<DailyFeelingValue, string> = {
    [FatigueLevelEnum.LOW]: "😊",
    [FatigueLevelEnum.MEDIUM]: "🙂",
    [FatigueLevelEnum.HIGH]: "😓",
  };

  const handleSubmit = async () => {
    if (!selected || isSubmitting) return;

    try {
      setError(null);
      setIsSubmitting(true);
      await submitPlanFeelingService(selected);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar tu respuesta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full rounded-2xl border border-gray-200 bg-bg-secondary p-6 md:p-8 flex flex-col">
      {submitted ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-black-400 mb-2">
              Gracias por responder
            </p>
            <p className="text-base font-medium text-gray-600">
              Hemos registrado tu respuesta.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-8 mt-2">
            <p className="text-4xl mb-2">💬</p>
            <h3 className="text-4xl font-bold text-black-400">
              ¿Cómo te sientes?
            </h3>
            <p className="text-gray-600 text-lg mt-2">
              Tu respuesta nos ayuda a adaptar tu rutina
            </p>
          </div>

          <div className="space-y-3">
            {FEELING_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelected(option.value)}
                disabled={isSubmitting}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  selected === option.value
                    ? "border-magent bg-magent/10"
                    : "border-gray-200 bg-white hover:border-magent/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none">
                    {optionEmoji[option.value]}
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-black-400">
                      {option.label}
                    </p>
                    <p className="text-base text-gray-600">
                      {optionDescription[option.value]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button
            type="button"
            className="w-full mt-auto h-12 text-lg"
            onClick={handleSubmit}
            disabled={!selected || isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Continuar"}
          </Button>
          {error ? (
            <p className="text-xs text-red-600 mt-2 text-center">{error}</p>
          ) : null}
        </>
      )}
    </div>
  );
}
