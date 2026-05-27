"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  Loader2,
  ThumbsUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Evaluation } from "@/types";

type Props = {
  evaluation: Evaluation;
  onComplete: (results: Record<string, string>) => Promise<void>;
  completedResults?: Record<string, unknown> | null;
};

export function RangeOfMotionEvaluation({
  evaluation,
  onComplete,
  completedResults,
}: Props) {
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expectedResultEntries = (() => {
    const entries = Object.entries(evaluation.expectedResults ?? {});
    const seenLabels = new Set<string>();
    const normalized = new Map<string, string>();

    const pushIfNew = (key: string, value: string) => {
      const label = String(value ?? "").trim();
      if (!label) return;
      const signature = label.toLowerCase();
      if (seenLabels.has(signature)) return;
      seenLabels.add(signature);
      normalized.set(key, label);
    };

    const levelEntries = entries
      .filter(([key]) => /^nivel_\d+$/i.test(key))
      .sort(
        ([a], [b]) =>
          Number(a.replace(/^\D+/g, "")) - Number(b.replace(/^\D+/g, "")),
      );
    levelEntries.forEach(([key, value]) => pushIfNew(key, value));

    const noneEntry = entries.find(([key]) => key.toLowerCase() === "ninguna");
    if (noneEntry) {
      pushIfNew(noneEntry[0], noneEntry[1]);
    }

    entries
      .filter(
        ([key]) => !/^nivel_\d+$/i.test(key) && key.toLowerCase() !== "ninguna",
      )
      .forEach(([key, value]) => pushIfNew(key, value));

    return Array.from(normalized.entries());
  })();

  const hasSelectedOption = selectedOptionKey !== null;
  const normalizeText = (value: unknown) =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const movementCompletedEntry = (() => {
    if (!completedResults) return null;

    if (completedResults.resultado !== undefined) {
      return ["resultado", completedResults.resultado] as const;
    }

    if (completedResults.respuesta !== undefined) {
      return ["respuesta", completedResults.respuesta] as const;
    }

    const first = Object.entries(completedResults)[0];
    return first ? ([first[0], first[1]] as const) : null;
  })();

  const movementRangeFeedback = (() => {
    if (!completedResults) return null;
    const storedValue = movementCompletedEntry?.[1];
    if (!storedValue) return null;

    const rules = (evaluation.feedbackRules ?? {}) as Record<string, unknown>;
    const valueFeedback =
      rules.valueFeedback && typeof rules.valueFeedback === "object"
        ? (rules.valueFeedback as Record<
            string,
            { level?: string; message?: string }
          >)
        : null;
    if (!valueFeedback) return null;

    const value = String(storedValue).trim();
    const normalizedValue = normalizeText(value);

    const selectedLabel =
      Object.entries(evaluation.expectedResults ?? {}).find(
        ([key, expectedValue]) =>
          normalizeText(key) === normalizedValue ||
          normalizeText(expectedValue) === normalizedValue,
      )?.[1] ?? value;

    const selectedFeedback =
      valueFeedback[value] ??
      valueFeedback[selectedLabel] ??
      Object.entries(valueFeedback).find(
        ([key]) => normalizeText(key) === normalizedValue,
      )?.[1] ??
      Object.entries(valueFeedback).find(
        ([key]) => normalizeText(key) === normalizeText(selectedLabel),
      )?.[1];

    if (!selectedFeedback?.message) return null;
    const normalizedLevel = normalizeText(selectedFeedback.level);
    const isOptimal = normalizedLevel === "a";

    return {
      isOptimal,
      message: selectedFeedback.message,
      selectedLabel,
    };
  })();

  const handleSelectOption = (key: string) => {
    setSelectedOptionKey(key);
  };

  const handleSubmit = async () => {
    if (!selectedOptionKey || isSubmitting) return;

    const selectedLabel = evaluation.expectedResults?.[selectedOptionKey];
    if (!selectedLabel) return;

    setIsSubmitting(true);
    try {
      await onComplete({ resultado: selectedLabel });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedResults) {
    return (
      <Card className="h-full rounded-2xl border-gray-200 p-4">
        <CardContent className="p-0 space-y-3 h-full overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-purple-100">
              <Image
                src={evaluation.logoUrl}
                alt={evaluation.name}
                width={36}
                height={36}
                className="w-[65%] h-[65%]"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {evaluation.name}
              </h2>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <Image
              src={evaluation.imageUrl}
              alt={evaluation.name}
              width={250}
              height={200}
            />
          </div>

          {evaluation.howToDo && (
            <p className="text-xl text-gray-700 leading-6 text-center">
              {evaluation.howToDo}
            </p>
          )}

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Respuesta Seleccionada
              </h3>
            </div>

            <div className="grid gap-3">
              {(movementCompletedEntry ? [movementCompletedEntry] : []).map(
                ([key, value]) => {
                  const label =
                    evaluation.expectedResults?.[key] ?? key.replace(/_/g, " ");
                  const cardColor = movementRangeFeedback
                    ? movementRangeFeedback.isOptimal
                      ? "border-green-400 bg-green-50"
                      : "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 bg-white";
                  const valueColor = movementRangeFeedback
                    ? movementRangeFeedback.isOptimal
                      ? "text-green-800"
                      : "text-yellow-800"
                    : "text-purple";

                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-4 ${cardColor}`}
                    >
                      <p className="text-sm font-semibold text-gray-500 capitalize mb-2">
                        {label}
                      </p>

                      <div className="flex items-center gap-2">
                        <Check className={`h-5 w-5 ${valueColor}`} />
                        <p className={`text-2xl font-bold ${valueColor}`}>
                          {movementRangeFeedback?.selectedLabel ??
                            String(value)}
                        </p>
                      </div>
                      {movementRangeFeedback ? (
                        <div
                          className={`mt-3 flex items-start gap-2 ${valueColor}`}
                        >
                          {movementRangeFeedback.isOptimal ? (
                            <ThumbsUp className="h-4 w-4 mt-0.5 shrink-0" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                          )}
                          <p className="text-sm leading-5">
                            {movementRangeFeedback.message}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="h-full rounded-2xl border-gray-200 p-4">
      <CardContent className="flex flex-col justify-between gap-3 p-0 h-full">
        <div className="flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-purple-100">
              <Image
                src={evaluation.logoUrl}
                alt={evaluation.name}
                width={36}
                height={36}
                className="w-[65%] h-[65%]"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {evaluation.name}
              </h2>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <Image
              src={evaluation.imageUrl}
              alt={evaluation.name}
              width={250}
              height={200}
            />
          </div>

          {evaluation.howToDo && (
            <p className="text-xl text-gray-700 leading-6 text-center">
              {evaluation.howToDo}
            </p>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Selecciona tu nivel
            </h2>
            <p className="text-base text-gray-600">
              Elige la opción que mejor describe tu rango de movimiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expectedResultEntries.map(([key, label]) => {
              const isSelected = selectedOptionKey === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectOption(key)}
                  disabled={isSubmitting}
                  className={`
                    w-full p-4 rounded-xl border-2 flex items-center justify-between
                    transition
                    ${
                      isSelected
                        ? "border-purple bg-purple-100"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }
                  `}
                >
                  <span
                    className={`
                      text-lg font-medium
                      ${isSelected ? "text-purple" : "text-gray-700"}
                    `}
                  >
                    {label}
                  </span>

                  <span
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${
                        isSelected
                          ? "border-purple bg-purple"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!hasSelectedOption || isSubmitting}
          className="w-full h-14 bg-purple text-white text-lg font-bold disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Enviando...
            </span>
          ) : (
            "Enviar resultados"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
