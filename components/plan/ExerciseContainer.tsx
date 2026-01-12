"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import type { UserPlan } from "@/types";
import Image from "next/image";
import { ExerciseCard } from "./ExerciseCard";
import { CongratsPanel } from "./CongratsPanel";

type Props = {
  userPlan?: UserPlan | null;
  loading: boolean;
  updatingProgress: boolean;
  changedRoutine: boolean;
  routineIndex?: number;
  exerciseIndex?: number;
  updatePlanProgress: () => Promise<void>;
  viewNextRoutine: () => void;
  onExerciseChange?: (routineIndex: number, exerciseIndex: number) => void;
};

export default function ExerciseContainer({
  userPlan,
  loading,
  updatingProgress,
  changedRoutine,
  routineIndex,
  exerciseIndex,
  updatePlanProgress,
  viewNextRoutine,
  onExerciseChange,
}: Props) {
  const router = useRouter();

  const routines = userPlan?.routines ?? [];
  const progressRoutineIndex = userPlan?.progressRoutine ?? 0;
  const progressExerciseIndex = userPlan?.progressExercise ?? 0;

  // Auto-advance to current exercise when progress updates
  useEffect(() => {
    if (!updatingProgress && userPlan && onExerciseChange) {
      onExerciseChange(progressRoutineIndex, progressExerciseIndex);
    }
  }, [
    progressRoutineIndex,
    progressExerciseIndex,
    updatingProgress,
    userPlan,
    onExerciseChange,
  ]);

  const selectedRoutineIndex = Number.isFinite(routineIndex)
    ? routineIndex!
    : progressRoutineIndex;

  const selectedExerciseIndex = Number.isFinite(exerciseIndex)
    ? exerciseIndex!
    : progressExerciseIndex;

  const currentRoutine = routines[selectedRoutineIndex];
  const currentExercise = currentRoutine?.exercises?.[selectedExerciseIndex];

  const isPlanCompleted = !!userPlan?.completedToday;

  const isCurrentExercise =
    !isPlanCompleted &&
    selectedRoutineIndex === progressRoutineIndex &&
    selectedExerciseIndex === progressExerciseIndex;

  const isCompletedExercise =
    isPlanCompleted ||
    selectedRoutineIndex < progressRoutineIndex ||
    (selectedRoutineIndex === progressRoutineIndex &&
      selectedExerciseIndex < progressExerciseIndex);

  const isLockedExercise =
    !isPlanCompleted &&
    (selectedRoutineIndex > progressRoutineIndex ||
      (selectedRoutineIndex === progressRoutineIndex &&
        selectedExerciseIndex > progressExerciseIndex));

  const statusMessage = isCompletedExercise
    ? "Ejercicio completado"
    : isLockedExercise
      ? "Completa los ejercicios anteriores para desbloquear este"
      : undefined;

  const statusType = isCompletedExercise
    ? "completed"
    : isLockedExercise
      ? "locked"
      : "info";

  const completedRoutineTitle = changedRoutine
    ? routines.find((routine) => routine.order === progressRoutineIndex)?.title
    : undefined;

  const handleCompleteExercise = async () => {
    if (updatingProgress) return;
    await updatePlanProgress();
  };

  const handleViewNextRoutine = async () => {
    viewNextRoutine();
  };
  return (
    <div className="flex-1 w-full">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-purple border-t-transparent" />
        </div>
      ) : changedRoutine ? (
        <div className="flex-1 flex items-center justify-center h-full">
          <CongratsPanel
            mode="routine"
            title={completedRoutineTitle}
            primaryLabel="Ver nueva rutina"
            onPrimary={handleViewNextRoutine}
          />
        </div>
      ) : !currentRoutine || !currentExercise ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600 text-center">
            No hay ejercicio disponible
          </p>
        </div>
      ) : (
        <ExerciseCard
          exercise={currentExercise}
          onComplete={isCurrentExercise ? handleCompleteExercise : undefined}
          isUpdating={updatingProgress}
          statusMessage={statusMessage}
          statusType={statusType}
          isActive={true}
        />
      )}
    </div>
  );
}
