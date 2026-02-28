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
        <PlanWeekProgress />
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
