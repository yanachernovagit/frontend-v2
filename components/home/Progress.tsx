"use client";

import Image from "next/image";
import { DailyStepsChart } from "./DailyStepsChart";
import { EvaluationsList } from "@/components/evaluations/EvaluationsList";

export function Progress() {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="inline-flex gap-2 font-bold text-black-400 mb-3">
        <Image
          src="/icons/magent/Positive-dynamic-magent.svg"
          alt="Progress"
          width={25}
          height={25}
        />
        Mi Progreso
      </h2>
      <DailyStepsChart />
      <EvaluationsList hideInstructions />
    </div>
  );
}
