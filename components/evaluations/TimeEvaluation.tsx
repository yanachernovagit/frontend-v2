"use client";

import Image from "next/image";
import { useState } from "react";
import { AlertTriangle, CheckCircle, ThumbsUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Evaluation } from "@/types";
import { useTimer } from "@/hooks/useTimer";
import { useAuth } from "@/hooks/useAuth";
import { getAgeFromBirthDate, getStsFeedback } from "@/lib/stsEvaluation";

import { VideoPreview } from "../shared";
import { EvaluationTimer } from "./EvaluationTimer";
import { EvaluationResults } from "./EvaluationResults";

type Props = {
  evaluation: Evaluation;
  onComplete: (results: Record<string, string>) => Promise<void>;
  completedResults?: Record<string, unknown> | null;
};

export function TimeEvaluation({
  evaluation,
  onComplete,
  completedResults,
}: Props) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const { user } = useAuth();

  const { remainingSeconds, isTimerFinished, timerStarted, startTimer } =
    useTimer({
      initialSeconds: evaluation.seconds || 0,
      isEnabled: !completedResults,
    });

  const expectedResultEntries = Object.entries(
    evaluation.expectedResults ?? {},
  );

  const allInputsFilled = expectedResultEntries.every(([key]) => {
    const value = inputValues[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  const canSubmit = isTimerFinished && allInputsFilled;
  const normalizedEvaluationName = evaluation.name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
  const isStsEvaluation = normalizedEvaluationName.includes(
    "sentarse y levantarse",
  );
  const birthDate = (user?.user_metadata as Record<string, unknown>)
    ?.birthDate as string | undefined;
  const stsFeedback = (() => {
    if (!completedResults) return null;
    if (!isStsEvaluation || !birthDate) return null;

    const age = getAgeFromBirthDate(birthDate);
    const repetitionsValue =
      Object.values(completedResults).find((value) => {
        const parsed =
          typeof value === "number"
            ? value
            : typeof value === "string"
              ? Number(value)
              : NaN;
        return Number.isFinite(parsed);
      }) ?? null;

    if (repetitionsValue == null) return null;

    const repetitions = Number(repetitionsValue);
    if (!Number.isFinite(repetitions)) return null;

    return getStsFeedback(repetitions, age);
  })();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onComplete(inputValues);
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
          {evaluation.videoUrl && (
            <div className="w-full h-80 rounded-2xl overflow-hidden border bg-black">
              <VideoPreview
                videoUrl={evaluation.videoUrl}
                allowFullscreen={true}
                muted={true}
                className="w-full h-full"
                loadingBackgroundClassName="bg-purple-400"
              />
            </div>
          )}

          {evaluation.howToDo && (
            <p className="text-xl text-gray-700 text-center leading-6">
              {evaluation.howToDo}
            </p>
          )}

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Resultados Registrados
              </h3>
            </div>

            <div className="grid gap-3">
              {Object.entries(completedResults).map(([key, value], index) => {
                const label =
                  evaluation.expectedResults?.[key] ?? key.replace(/_/g, " ");
                const feedbackColor = stsFeedback
                  ? stsFeedback.level === "above"
                    ? "border-green-400 bg-green-50 text-green-800"
                    : stsFeedback.level === "within"
                      ? "border-yellow-400 bg-yellow-50 text-yellow-800"
                      : "border-red-400 bg-red-50 text-red-800"
                  : "border-gray-200 bg-white text-purple";

                return (
                  <div
                    key={key}
                    className={`rounded-xl border p-4 ${feedbackColor}`}
                  >
                    <p className="text-sm font-semibold text-gray-500 capitalize mb-1">
                      {label}
                    </p>
                    <p className="text-2xl font-bold">{String(value)}</p>
                    {stsFeedback && index === 0 ? (
                      <div className="mt-3 flex items-start gap-2">
                        {stsFeedback.level === "above" ? (
                          <ThumbsUp className="h-4 w-4 mt-0.5 shrink-0" />
                        ) : stsFeedback.level === "within" ? (
                          <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                        )}
                        <p className="text-sm leading-5">
                          {stsFeedback.message}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (isTimerFinished) {
    return (
      <Card className="h-full rounded-2xl border-gray-200 p-4">
        <CardContent className="p-0 space-y-3 h-full overflow-y-auto">
          <EvaluationResults
            expectedResults={evaluation.expectedResults ?? {}}
            inputValues={inputValues}
            onInputChange={(key, value) =>
              setInputValues((prev) => ({ ...prev, [key]: value }))
            }
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="h-full rounded-2xl border-gray-200 p-4">
      <CardContent className="flex flex-col justify-between gap-3 p-0 h-full space-y-3">
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

          {evaluation.videoUrl && (
            <div className="w-full h-80 rounded-2xl overflow-hidden border bg-black">
              <VideoPreview
                videoUrl={evaluation.videoUrl}
                allowFullscreen={true}
                muted={true}
                className="w-full h-full"
                loadingBackgroundClassName="bg-purple-400"
              />
            </div>
          )}

          {evaluation.howToDo && (
            <p className="text-xl text-gray-700 text-center leading-6">
              {evaluation.howToDo}
            </p>
          )}
        </div>

        <EvaluationTimer
          remainingSeconds={remainingSeconds}
          timerStarted={timerStarted}
          onStart={startTimer}
        />
      </CardContent>
    </Card>
  );
}
