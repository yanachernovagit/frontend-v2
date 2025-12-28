"use client";

import { useAuth } from "@/hooks/useAuth";
import { Task } from "@/types";
import { useUserTasks } from "@/hooks/useUserTasks";
import { useEffect } from "react";
import { SkeletonTaskList } from "./SkeletonTaskList";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { TaskCard } from "./TaskCard";
import { Card } from "../ui/card";

export function TasksCarousel() {
  const { user } = useAuth();
  const { userTasks, loading, refetch } = useUserTasks(user?.sub);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const tasks: Task[] = [
    {
      title: "Completar mi perfil",
      description: "Responde algunas preguntas sobre ti",
      icon: (
        <Image
          src="/icons/white/Volunteering.svg"
          alt="Profile"
          width={30}
          height={30}
        />
      ),
      disabled: userTasks?.profileCompleted,
      linkTo: "/profile",
      visible: !userTasks?.profileCompleted,
    },
    {
      title: "Primer test",
      description: "Evaluación diagnóstico de tu condición física",
      icon: (
        <Image
          src="/icons/white/Favorites-shield.svg"
          alt="Shield"
          width={30}
          height={30}
        />
      ),
      disabled: userTasks?.firstEvaluationCompleted,
      linkTo: "/evaluation-test",
      visible: !userTasks?.firstEvaluationCompleted,
    },
    {
      title: "Mi Plan",
      description: "Ya estás lista para comenzar el ejercicio físico",
      icon: (
        <Image
          src="/icons/white/Barbell.svg"
          alt="Barbell"
          width={30}
          height={30}
        />
      ),
      disabled: userTasks?.dailyPlanCompleted,
      linkTo: "/plan",
      visible: userTasks?.firstEvaluationCompleted,
    },
  ];

  const sortedTasks = tasks
    .filter((task) => task.visible)
    .sort((a, b) => Number(a.disabled ?? false) - Number(b.disabled ?? false));

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="inline-flex gap-2 font-bold text-black-400 mb-3">
        <Image
          src="/icons/magent/Task-magent.svg"
          alt="Tasks"
          width={25}
          height={25}
        />
        Mis Tareas
      </h2>

      <Card className="flex-1 min-h-0 p-2 space-y-4 overflow-y-auto bg-bg-secondary rounded-xl">
        {loading ? (
          <SkeletonTaskList count={3} />
        ) : !userTasks ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full px-8">
            <AlertCircle className="w-12 h-12 text-magent" />
            <p className="text-center text-lg font-bold text-magent mt-4 mb-2">
              No se pudieron cargar tus tareas
            </p>
            <Button
              onClick={refetch}
              className="bg-magent px-7 py-3 rounded-full mt-2 hover:bg-magent/90"
            >
              <span className="text-white font-semibold text-base">
                Reintentar
              </span>
            </Button>
          </div>
        ) : (
          <>
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={index}
                title={task.title}
                description={task.description}
                icon={task.icon}
                disabled={task.disabled}
                linkTo={task.linkTo}
              />
            ))}
          </>
        )}
      </Card>
    </div>
  );
}
