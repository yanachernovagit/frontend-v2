"use client";

import { Button } from "@/components/ui/button";
import { Play, Timer } from "lucide-react";

type Props = {
  remainingSeconds: number;
  timerStarted: boolean;
  onStart: () => void;
};

export const EvaluationTimer = ({
  remainingSeconds,
  timerStarted,
  onStart,
}: Props) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!timerStarted) {
    return (
      <Button
        onClick={onStart}
        className="bg-purple hover:bg-purple/90 rounded-full px-6 py-8 flex items-center justify-center gap-2 shadow-lg w-full"
      >
        <Play className="w-10 h-10" fill="white" />
        <span className="text-3xl font-bold text-white">Iniciar</span>
      </Button>
    );
  }

  return (
    <div className="bg-bg-secondary shadow-lg rounded-full px-4 py-6">
      <div className="flex items-center justify-center gap-2">
        <Timer className="w-10 h-10 text-gray-700" />
        <span className="text-3xl font-bold text-black-400">
          {formatTime(Math.max(remainingSeconds, 0))}
        </span>
      </div>
    </div>
  );
};
