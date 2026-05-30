"use client";

import {
  DailyStepsChart,
  PlanWeekProgress,
  TasksCarousel,
  WelcomeCard,
} from "@/components/home";
import { useUserTasks } from "@/hooks/useUserTasks";
import Image from "next/image";

export default function InicioPage() {
  const { userTasks, loading, refetch } = useUserTasks();
  const canShowPlanProgress =
    userTasks?.profileCompleted === true &&
    userTasks?.firstEvaluationCompleted === true;

  return (
    <div className="grid h-full w-full min-h-0 grid-cols-1 gap-4 overflow-y-auto pr-1 xl:grid-cols-2">
      <div className="min-w-0">
        <WelcomeCard userTasks={userTasks} loading={loading} />
      </div>

      <div className="flex min-h-0 min-w-0 flex-col">
        <h2 className="inline-flex gap-2 pb-1 font-bold text-black-400">
          <Image
            src="/icons/magent/Task-magent.svg"
            alt="Tasks"
            width={25}
            height={25}
          />
          Mis Tareas
        </h2>
        <TasksCarousel
          userTasks={userTasks}
          loading={loading}
          refetch={refetch}
        />
      </div>

      <div className="min-w-0">
        {canShowPlanProgress ? (
          <PlanWeekProgress />
        ) : (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="text-base font-semibold text-gray-900">
              Progreso del plan
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Completa tu perfil y la evaluación inicial para activar tu plan.
            </p>
          </div>
        )}
      </div>

      <div className="flex min-h-0 min-w-0 flex-col">
        <h2 className="inline-flex gap-2 pb-1 font-bold text-black-400">
          <Image
            src="/icons/magent/Trainers-magent.svg"
            alt="Pasos"
            width={25}
            height={25}
          />
          Mis pasos
        </h2>
        <DailyStepsChart />
      </div>
    </div>
  );
}
