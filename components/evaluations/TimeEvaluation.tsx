"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Evaluation } from "@/types";
import { useTimer } from "@/hooks/useTimer";

import { VideoPreview } from "../shared";
import { EvaluationTimer } from "./EvaluationTimer";
import { EvaluationResults } from "./EvaluationResults";

type Props = {
  evaluation: Evaluation;
  onComplete: (results: Record<string, string>) => Promise<void>;
  completedResults?: Record<string, any> | null;
};

export function TimeEvaluation({
  evaluation,
  onComplete,
  completedResults,
}: Props) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

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
              {Object.entries(completedResults).map(([key, value]) => {
                const label =
                  evaluation.expectedResults?.[key] ?? key.replace(/_/g, " ");

                return (
                  <div key={key} className="rounded-xl border bg-white p-4">
                    <p className="text-sm font-semibold text-gray-500 capitalize mb-1">
                      {label}
                    </p>
                    <p className="text-2xl font-bold text-purple">{value}</p>
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
