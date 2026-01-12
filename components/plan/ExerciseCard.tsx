"use client";

import Image from "next/image";
import { Info } from "lucide-react";

import type { Exercise } from "@/types";
import ApprovalBlue from "@/public/icons/blue/Approval (1).svg";
import RepeatBlack from "@/public/icons-exercises/Repeat-black.svg";
import BarbellMagent from "@/public/icons/magent/Barbell-magent.svg";
import ClockBlack from "@/public/icons-exercises/Clock-black.svg";
import { VideoPreview } from "@/components/shared/VideoPreview";
import { Button } from "@/components/ui/button";

type Props = {
  exercise: Exercise;
  onComplete?: () => Promise<void>;
  isUpdating: boolean;
  statusMessage?: string;
  statusType?: "completed" | "locked" | "info";
  isActive?: boolean;
};

export function ExerciseCard({
  exercise,
  onComplete,
  isUpdating,
  statusMessage,
  statusType = "info",
  isActive = true,
}: Props) {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto w-full">
        {exercise.videoUrl ? (
          <div className="w-full h-72 rounded-2xl overflow-hidden bg-black border border-gray-200 mb-4">
            <VideoPreview
              videoUrl={exercise.videoUrl}
              allowFullscreen
              muted
              isActive={isActive}
              className="w-full h-full"
              loadingBackgroundClassName="bg-purple-400"
            />
          </div>
        ) : exercise.videoCoverUrl ? (
          <div className="w-full h-60 relative mb-4">
            <Image
              src={exercise.videoCoverUrl}
              alt={exercise.name}
              fill
              className="object-contain"
            />
          </div>
        ) : null}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-magent rounded-full flex items-center justify-center text-white font-bold">
            {exercise.order}
          </div>
          <h2 className="text-2xl font-bold text-black flex-1">
            {exercise.name}
          </h2>
        </div>

        {exercise.description && (
          <p className="text-base text-gray-700 leading-6 mb-4">
            {exercise.description}
          </p>
        )}
        <div className="flex justify-around mb-6 ">
          {exercise.duration != null && exercise.duration > 0 && (
            <div className="flex flex-col items-center">
              <Image src={ClockBlack} alt="Duración" width={20} height={20} />
              <span className="text-xs text-gray-600 mt-1">Duración</span>
              <span className="text-sm font-bold text-purple">
                {exercise.duration}s
              </span>
            </div>
          )}

          <div className="flex flex-col items-center">
            <Image
              src={RepeatBlack}
              alt="Repeticiones"
              width={20}
              height={20}
            />
            <span className="text-xs text-gray-600 mt-1">Reps</span>
            <span className="text-sm font-bold text-purple">
              {exercise.reps}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Image src={BarbellMagent} alt="Sets" width={20} height={20} />
            <span className="text-xs text-gray-600 mt-1">Sets</span>
            <span className="text-sm font-bold text-purple">
              {exercise.sets}
            </span>
          </div>

          {exercise.weight != null && (
            <div className="flex flex-col items-center">
              <Image src={BarbellMagent} alt="Peso" width={20} height={20} />
              <span className="text-xs text-gray-600 mt-1">Peso</span>
              <span className="text-sm font-bold text-purple">
                {exercise.weight}kg
              </span>
            </div>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="w-full">
          <div
            className={`
              flex items-center justify-center gap-2 rounded-xl p-4 border w-full
              ${
                statusType === "completed"
                  ? "border-purple"
                  : "bg-gray-100 border-gray-200"
              }
            `}
          >
            {statusType === "completed" ? (
              <Image
                src={ApprovalBlue}
                alt="Completado"
                width={20}
                height={20}
              />
            ) : (
              <Info className="h-5 w-5 text-gray-500" />
            )}
            <p
              className={`text-sm ${
                statusType === "completed" ? "text-purple" : "text-gray-700"
              }`}
            >
              {statusMessage}
            </p>
          </div>
        </div>
      )}

      {onComplete && (
        <div className="pt-2 w-full">
          <Button
            onClick={onComplete}
            disabled={isUpdating}
            className="bg-magent w-full font-bold h-12"
          >
            Hecho
          </Button>
        </div>
      )}
    </div>
  );
}
