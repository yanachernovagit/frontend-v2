"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, CheckCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Evaluation } from "@/types";
import { VideoPreview } from "../shared";

type Props = {
  evaluation: Evaluation;
  onComplete: (results: Record<string, string>) => Promise<void>;
  completedResults?: Record<string, any> | null;
};

export function RangeOfMotionEvaluation({
  evaluation,
  onComplete,
  completedResults,
}: Props) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const expectedResultEntries = Object.entries(
    evaluation.expectedResults ?? {},
  );

  const allOptionsSelected = expectedResultEntries.every(([key]) => {
    return selectedOptions[key]?.trim().length > 0;
  });

  const handleSelectOption = (key: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!allOptionsSelected) return;
    await onComplete(selectedOptions);
  };

  const renderVideoPreview = () => {
    if (!evaluation.videoUrl) return null;

    return (
      <div className="mb-6">
        <div className="w-full h-80 rounded-2xl overflow-hidden border bg-black">
          <VideoPreview
            videoUrl={evaluation.videoUrl}
            allowFullscreen={true}
            muted={true}
            className="w-full h-full"
            loadingBackgroundClassName="bg-purple-400"
          />
        </div>
      </div>
    );
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
          {renderVideoPreview()}

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
              {Object.entries(completedResults).map(([key, value]) => {
                const label =
                  evaluation.expectedResults?.[key] ?? key.replace(/_/g, " ");

                return (
                  <div key={key} className="rounded-xl border bg-white p-4">
                    <p className="text-sm font-semibold text-gray-500 capitalize mb-2">
                      {label}
                    </p>

                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-purple" />
                      <p className="text-2xl font-bold text-purple">{value}</p>
                    </div>
                  </div>
                );
              })}
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

          {renderVideoPreview()}

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

          <div className="space-y-3">
            {expectedResultEntries.map(([key, label]) => {
              const isSelected = selectedOptions[key] === label;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectOption(key, label as string)}
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
          disabled={!allOptionsSelected}
          className="w-full h-14 bg-purple text-white text-lg font-bold disabled:bg-gray-400"
        >
          Enviar resultados
        </Button>
      </CardContent>
    </Card>
  );
}
