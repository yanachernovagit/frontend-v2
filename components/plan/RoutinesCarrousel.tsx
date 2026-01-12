"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

import BarbellMagent from "@/public/icons/magent/Barbell-magent.svg";
import ClockBlack from "@/public/icons-exercises/Clock-black.svg";
import type { UserPlan } from "@/types";
import { ExerciseListItem } from "./ExerciseListItem";
import { SkeletonRoutineList } from "./SkeletonRoutineList";

type Props = {
  userPlan?: UserPlan | null;
  loading: boolean;
  refetch: () => void;
  onSelectExercise?: (routineIndex: number, exerciseIndex: number) => void;
};

export function RoutineCarousel({
  userPlan,
  loading,
  refetch,
  onSelectExercise,
}: Props) {
  const router = useRouter();

  const routines = userPlan?.routines ?? [];
  const currentRoutineIndex = userPlan?.progressRoutine ?? 0;
  const currentExerciseIndex = userPlan?.progressExercise ?? 0;

  const isFirstRender = useRef(true);
  const currentExerciseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    refetch();
  }, [refetch]);

  // Auto-scroll to current exercise when it changes
  useEffect(() => {
    if (!loading && currentExerciseRef.current) {
      setTimeout(() => {
        currentExerciseRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [loading, currentRoutineIndex, currentExerciseIndex]);

  const handleExercisePress = useCallback(
    (routineIndex: number, exerciseIndex: number) => {
      if (onSelectExercise) {
        onSelectExercise(routineIndex, exerciseIndex);
      } else {
        router.push(
          `/exercise?routineIndex=${routineIndex}&exerciseIndex=${exerciseIndex}`,
        );
      }
    },
    [router, onSelectExercise],
  );

  if (loading) {
    return (
      <div className="w-full px-2 pt-4">
        <SkeletonRoutineList count={4} />
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600 text-lg">No hay rutinas disponibles</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full px-2 py-2 space-y-5 overflow-y-auto">
      {routines
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((routine, routineIdx) => {
          const totalExercises = routine.exercises.length;

          const totalDurationInSeconds = routine.exercises.reduce(
            (acc, exercise) => acc + (exercise.duration ?? 0),
            0,
          );

          const durationInMinutes = Math.ceil(totalDurationInSeconds / 60);

          return (
            <div key={`routine-${routineIdx}`} className="space-y-3">
              <div className="flex items-center justify-between px-2 border-b-2 border-purple-400 pb-2">
                <div className="flex items-center gap-2 flex-1">
                  {routine.iconUrl && (
                    <div className="shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Image
                        src={routine.iconUrl}
                        alt={routine.title}
                        width={28}
                        height={28}
                        className="w-[60%] h-[60%]"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900">
                    {routine.title}
                  </h3>
                </div>

                <div className="flex items-center text-xs text-gray-600">
                  <Image
                    src={BarbellMagent}
                    alt="Ejercicios"
                    width={12}
                    height={12}
                  />
                  <span className="ml-1">
                    {totalExercises}{" "}
                    {totalExercises === 1 ? "ejercicio" : "ejercicios"}
                  </span>

                  {durationInMinutes > 0 && (
                    <>
                      <span className="mx-2 w-1 h-1 rounded-full bg-gray-300 inline-block" />
                      <Image
                        src={ClockBlack}
                        alt="Duración"
                        width={12}
                        height={12}
                      />
                      <span className="ml-1">{durationInMinutes} min</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {routine.exercises
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((exercise, exerciseIdx) => {
                    const isCurrentRoutine = currentRoutineIndex === routineIdx;

                    const isCurrentExercise =
                      isCurrentRoutine && currentExerciseIndex === exerciseIdx;

                    const isCompleted =
                      !!userPlan?.completedToday ||
                      routineIdx < currentRoutineIndex ||
                      (isCurrentRoutine && exerciseIdx < currentExerciseIndex);

                    return (
                      <div
                        key={`exercise-${routineIdx}-${exerciseIdx}`}
                        ref={isCurrentExercise ? currentExerciseRef : null}
                      >
                        <ExerciseListItem
                          exercise={exercise}
                          isCompleted={isCompleted}
                          isCurrent={isCurrentExercise}
                          isPlanCompleted={!!userPlan?.completedToday}
                          onPress={() =>
                            handleExercisePress(routineIdx, exerciseIdx)
                          }
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
