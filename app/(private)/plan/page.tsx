"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { RoutineCarousel } from "@/components/plan";
import ExerciseContainer from "@/components/plan/ExerciseContainer";
import { Card } from "@/components/ui/card";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useUserTasks } from "@/hooks/useUserTasks";
import PositiveDynamicMagent from "@/public/icons/magent/Positive-dynamic-magent.svg";
import TaskMagent from "@/public/icons/magent/Task-magent.svg";

type SelectedExercise = {
  routineIndex: number;
  exerciseIndex: number;
} | null;

export default function PlanPage() {
  const router = useRouter();

  const {
    userPlan,
    loading: loadingPlan,
    refetch: refetchPlan,
    updatePlanProgress,
    updatingProgress,
    changedRoutine,
    viewNextRoutine,
  } = useUserPlan();

  const { userTasks, loading: loadingTasks, refetch } = useUserTasks();

  const [selectedExercise, setSelectedExercise] =
    useState<SelectedExercise>(null);

  const handleCompleteProfile = useCallback(() => {
    router.push("/auth/questions");
  }, [router]);

  const handleCompleteEvaluation = useCallback(() => {
    router.push("/evaluaciones");
  }, [router]);

  const handleSelectExercise = useCallback(
    (routineIndex: number, exerciseIndex: number) => {
      setSelectedExercise({ routineIndex, exerciseIndex });
    },
    [],
  );

  const handleUpdateProgress = useCallback(async () => {
    await updatePlanProgress();
  }, [updatePlanProgress]);

  const handleExerciseChange = useCallback(
    (routineIndex: number, exerciseIndex: number) => {
      setSelectedExercise({ routineIndex, exerciseIndex });
    },
    [],
  );

  return (
    <div className="h-full w-full grid grid-cols-2 gap-3 overflow-hidden">
      <Card className="bg-bg-secondary rounded-xl h-full flex flex-col gap-1 p-2 w-full overflow-hidden">
        <h2 className="font-bold text-2xl text-magent text-center w-full shrink-0">
          Ejercicios de hoy
        </h2>
        {!loadingTasks && !userTasks ? (
          <div className="h-full w-full flex flex-col items-center justify-center px-8">
            <p className="text-center text-xl font-bold text-magent mb-4">
              No se pudieron cargar tus tareas. Por favor, intenta nuevamente.
            </p>
            <Button
              onClick={refetch}
              className="bg-magent w-full max-w-[250px]"
            >
              Reintentar
            </Button>
          </div>
        ) : !loadingTasks && userTasks && !userTasks.profileCompleted ? (
          <div className="h-full w-full flex flex-col items-center justify-center px-8">
            <p className="text-center text-xl font-bold text-magent mb-6">
              Debes completar las preguntas para que podamos darte un plan
            </p>
            <Button
              onClick={handleCompleteProfile}
              className="bg-magent w-full max-w-[280px]"
            >
              Completar Preguntas
            </Button>
          </div>
        ) : !loadingTasks &&
          userTasks &&
          !userTasks.firstEvaluationCompleted ? (
          <div className="h-full w-full flex flex-col items-center justify-center px-8">
            <Image
              src={PositiveDynamicMagent}
              alt="Evaluación"
              width={80}
              height={80}
            />
            <p className="text-center text-xl font-bold text-magent mb-6 mt-4">
              Debes completar los test de evaluación para poder comenzar tu plan
            </p>
            <Button
              onClick={handleCompleteEvaluation}
              className="bg-magent w-full max-w-[280px]"
            >
              Completar Evaluación
            </Button>
          </div>
        ) : !loadingTasks &&
          userPlan &&
          userPlan.currentWeek > userPlan.totalWeeks &&
          userTasks &&
          !userTasks.secondEvaluationCompleted ? (
          <div className="h-full w-full flex flex-col items-center justify-center px-8">
            <Image
              src={TaskMagent}
              alt="Evaluación Completada"
              width={80}
              height={80}
            />
            <p className="text-center text-xl font-bold text-magent mb-6 mt-4">
              ¡Felicidades! Has completado tu plan. Ahora debes realizar los
              test de evaluación post plan
            </p>
            <Button
              onClick={handleCompleteEvaluation}
              className="bg-magent w-full max-w-[280px]"
            >
              Completar Evaluación
            </Button>
          </div>
        ) : (
          <div className="flex flex-col w-full min-h-0 flex-1">
            <RoutineCarousel
              userPlan={userPlan}
              loading={loadingPlan || loadingTasks}
              refetch={refetchPlan}
              onSelectExercise={handleSelectExercise}
            />
          </div>
        )}
      </Card>

      <Card className="bg-white rounded-xl h-full flex items-center justify-center overflow-hidden p-3">
        <ExerciseContainer
          userPlan={userPlan}
          loading={loadingPlan}
          updatingProgress={updatingProgress}
          changedRoutine={changedRoutine}
          routineIndex={selectedExercise?.routineIndex}
          exerciseIndex={selectedExercise?.exerciseIndex}
          updatePlanProgress={handleUpdateProgress}
          viewNextRoutine={viewNextRoutine}
          onExerciseChange={handleExerciseChange}
        />
      </Card>
    </div>
  );
}
