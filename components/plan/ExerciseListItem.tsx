"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

import type { Exercise } from "@/types";
import ApprovalBlue from "@/public/icons/blue/Approval (1).svg";
import RepeatBlack from "@/public/icons-exercises/Repeat-black.svg";
import BarbellMagent from "@/public/icons/magent/Barbell-magent.svg";
import ClockBlack from "@/public/icons-exercises/Clock-black.svg";

type Props = {
  exercise: Exercise;
  isCompleted: boolean;
  isCurrent: boolean;
  isPlanCompleted?: boolean;
  onPress: () => void;
};

export function ExerciseListItem({
  exercise,
  isCompleted,
  isCurrent,
  isPlanCompleted = false,
  onPress,
}: Props) {
  const { name, sets, reps, weight, duration, videoCoverUrl } = exercise;

  return (
    <button
      type="button"
      onClick={onPress}
      className={`
        w-full text-left rounded-xl p-4 border transition
        focus:outline-none focus:ring-2 focus:ring-purple/40
        ${
          isCurrent
            ? "bg-purple-50 border-purple"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {videoCoverUrl ? (
            <Image
              src={videoCoverUrl}
              alt={name}
              width={64}
              height={64}
              className="rounded-xl object-cover"
            />
          ) : null}

          <div className="flex-1 min-w-0">
            <p
              className={`
                text-base font-semibold line-clamp-2
                ${isCurrent ? "text-purple" : "text-gray-900"}
              `}
            >
              {name}
            </p>

            <div className="flex items-center mt-2 flex-wrap gap-2 text-xs text-gray-600">
              {sets != null && reps != null && (
                <div className="flex items-center">
                  <Image
                    src={RepeatBlack}
                    alt="Repeticiones"
                    width={14}
                    height={14}
                  />
                  <span className="ml-1">
                    {sets} × {reps}
                  </span>
                </div>
              )}

              {weight != null && weight > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center">
                    <Image
                      src={BarbellMagent}
                      alt="Peso"
                      width={14}
                      height={14}
                    />
                    <span className="ml-1">{weight} kg</span>
                  </div>
                </>
              )}

              {duration != null && duration > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center">
                    <Image
                      src={ClockBlack}
                      alt="Tiempo"
                      width={14}
                      height={14}
                    />
                    <span className="ml-1">{Math.ceil(duration / 60)} min</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="ml-3 shrink-0">
          {isPlanCompleted ? (
            <div className="flex flex-col items-center">
              <Image
                src={ApprovalBlue}
                alt="Completado"
                width={24}
                height={24}
              />
              <span className="mt-1 text-[10px] text-purple">Completado</span>
            </div>
          ) : isCurrent ? (
            <span className="bg-purple text-white rounded-full px-3 py-1.5 text-xs font-bold">
              Actual
            </span>
          ) : isCompleted ? (
            <div className="flex flex-col items-center">
              <Image
                src={ApprovalBlue}
                alt="Completado"
                width={24}
                height={24}
              />
              <span className="mt-1 text-[10px] text-purple">Completado</span>
            </div>
          ) : (
            <ChevronRight className="h-6 w-6 text-gray-400" />
          )}
        </div>
      </div>
    </button>
  );
}
