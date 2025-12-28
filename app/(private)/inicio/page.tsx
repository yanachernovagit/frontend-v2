import { EvaluationsList } from "@/components/evaluations";
import { DailyStepsChart, TasksCarousel, WelcomeCard } from "@/components/home";
import Image from "next/image";

export default function InicioPage() {
  return (
    <div className="flex w-full h-full gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 w-full h-full">
        <WelcomeCard />
        <div className="flex-1 min-h-0 flex flex-col">
          <h2 className="inline-flex gap-2 font-bold text-black-400 pb-1">
            <Image
              src="/icons/magent/Favorites-shield-magent.svg"
              alt="Tasks"
              width={25}
              height={25}
            />
            Evaluaciones realizadas
          </h2>
          <div className="flex-1 min-h-0">
            <EvaluationsList hideInstructions />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <h2 className="inline-flex gap-2 font-bold text-black-400 pb-1">
          <Image
            src="/icons/magent/Task-magent.svg"
            alt="Tasks"
            width={25}
            height={25}
          />
          Mis Tareas
        </h2>
        <TasksCarousel />
        <h2 className="inline-flex gap-2 font-bold text-black-400 pb-1 mt-4">
          <Image
            src="/icons/magent/Trainers-magent.svg"
            alt="Tasks"
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
