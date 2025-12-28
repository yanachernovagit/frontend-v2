"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Evaluation } from "@/types";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/useTimer";
import { ArmVolumeInput } from "./ArmVolumeInput";
import { EvaluationTimer } from "./EvaluationTimer";
import { EvaluationResults } from "./EvaluationResults";
import { PlayCircle } from "lucide-react";

type Props = {
  evaluation: Evaluation;
  onComplete: (results: Record<string, string>) => Promise<void>;
  isUpdating: boolean;
};

export const EvaluationDetailCard = ({ evaluation, onComplete }: Props) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [showVolumeInputs, setShowVolumeInputs] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const { remainingSeconds, isTimerFinished, timerStarted, startTimer } =
    useTimer({
      initialSeconds:
        typeof evaluation?.seconds === "number" ? evaluation.seconds : 0,
      isEnabled: !!evaluation?.isTime,
    });

  const expectedResultEntries = evaluation
    ? Object.entries(evaluation.expectedResults ?? {})
    : [];

  useEffect(() => {
    if (!evaluation) {
      setInputValues({});
      return;
    }

    const baseInputs = expectedResultEntries.reduce<Record<string, string>>(
      (acc, [key]) => {
        acc[key] = "";
        return acc;
      },
      {},
    );

    if (!evaluation.isTime) {
      for (let i = 1; i <= 6; i++) {
        baseInputs[`left_${i}`] = "";
        baseInputs[`right_${i}`] = "";
      }
    }

    setInputValues(baseInputs);
  }, [evaluation]);

  const hasExpectedResults = expectedResultEntries.length > 0;

  const allInputsFilled = expectedResultEntries.every(([key]) => {
    const value = inputValues[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  const allArmInputsFilled = !evaluation?.isTime
    ? [1, 2, 3, 4, 5, 6].every((point) => {
        const leftValue = inputValues[`left_${point}`];
        const rightValue = inputValues[`right_${point}`];
        return (
          typeof leftValue === "string" &&
          leftValue.trim().length > 0 &&
          typeof rightValue === "string" &&
          rightValue.trim().length > 0
        );
      })
    : true;

  const canSubmitResults = evaluation?.isTime
    ? isTimerFinished && hasExpectedResults && allInputsFilled
    : allArmInputsFilled;

  const handlePrimaryAction = async () => {
    if (!canSubmitResults) return;

    const resultsToSend = { ...inputValues };

    await onComplete(resultsToSend);
  };

  const handleWatchVideo = () => {
    if (!evaluation.videoUrl) return;
    setShowVideoPlayer(true);
  };

  if (evaluation.isTime && isTimerFinished) {
    return (
      <div className="w-full h-full flex flex-col border border-gray-200 rounded-2xl mt-5 p-3">
        <EvaluationResults
          expectedResults={evaluation.expectedResults ?? {}}
          inputValues={inputValues}
          onInputChange={(key, value) =>
            setInputValues((prev) => ({ ...prev, [key]: value }))
          }
          onSubmit={handlePrimaryAction}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        {!evaluation.isTime && !showVolumeInputs ? (
          <>
            <div className="flex-1 p-3 overflow-y-auto">
              {evaluation.imageUrl && (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={evaluation.imageUrl}
                    alt={evaluation.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {evaluation.howToDo && (
                <div className="mt-8">
                  <p className="text-xl text-gray-700 leading-6 text-center">
                    {evaluation.howToDo}
                  </p>
                </div>
              )}

              {evaluation.videoUrl && (
                <div className="flex items-center justify-center mb-8 mt-3">
                  <Button variant="outline_magent" onClick={handleWatchVideo}>
                    <PlayCircle className="w-6 h-6 text-magent" />
                    Ver video tutorial
                  </Button>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 pt-3">
              <Button
                onClick={() => setShowVolumeInputs(true)}
                className="bg-purple hover:bg-purple/90 w-full py-6"
              >
                <span className="text-white font-bold text-xl">Continuar</span>
              </Button>
            </div>
          </>
        ) : !evaluation.isTime && showVolumeInputs ? (
          <>
            <div className="flex-1 p-3 overflow-y-auto">
              <ArmVolumeInput
                inputValues={inputValues}
                onInputChange={(key, value) =>
                  setInputValues((prev) => ({ ...prev, [key]: value }))
                }
              />
            </div>

            <div className="p-3">
              <Button
                onClick={handlePrimaryAction}
                disabled={!allArmInputsFilled}
                className={`w-full py-6 ${allArmInputsFilled ? "bg-purple hover:bg-purple/90" : "bg-gray-400"}`}
              >
                <span className="text-white font-bold text-xl">
                  Enviar resultados
                </span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 p-3 overflow-y-auto">
              {evaluation.imageUrl && (
                <div className="relative pb-4">
                  <div className="relative w-full h-60 rounded-2xl overflow-hidden">
                    <Image
                      src={evaluation.imageUrl}
                      alt={evaluation.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {evaluation.howToDo && (
                <div className="mb-6">
                  <p className="text-xl text-gray-700 leading-6 text-center">
                    {evaluation.howToDo}
                  </p>
                </div>
              )}

              {evaluation.videoUrl && (
                <div className="flex items-center justify-center mb-8">
                  <Button variant="outline_magent" onClick={handleWatchVideo}>
                    <PlayCircle className="w-6 h-6 text-magent" />
                    Ver video tutorial
                  </Button>
                </div>
              )}
            </div>

            {evaluation.isTime && (
              <div className="p-3">
                <EvaluationTimer
                  remainingSeconds={remainingSeconds}
                  timerStarted={timerStarted}
                  onStart={startTimer}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Player Modal */}
      {evaluation.videoUrl && showVideoPlayer && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoPlayer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoPlayer(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <video
              src={evaluation.videoUrl}
              controls
              autoPlay
              className="w-full h-full"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};
