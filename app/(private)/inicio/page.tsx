import { Progress, TasksCarousel, WelcomeCard } from "@/components/home";

export default function InicioPage() {
  return (
    <div className="flex w-full h-full gap-4">
      <div className="flex flex-col gap-4 w-full h-full">
        <WelcomeCard />
        <div className="flex-1 min-h-0">
          <TasksCarousel />
        </div>
      </div>
      <div className="w-full">
        <Progress />
      </div>
    </div>
  );
}
