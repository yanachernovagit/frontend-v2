"use client";

import Image from "next/image";
import Confetti from "@/public/icons/white/Confetti.svg";
import { Button } from "@/components/ui/button";

type Props = {
  mode: "routine" | "workout";
  title?: string;
  primaryLabel: string;
  onPrimary: () => Promise<void>;
};

export function CongratsPanel({ mode, title, primaryLabel, onPrimary }: Props) {
  const showPrimary = mode === "routine";

  return (
    <div className="flex flex-col items-center justify-between bg-magent rounded-3xl w-full h-full p-3 pt-10">
      <div className="flex items-center mb-4">
        <Image src={Confetti} alt="Confetti" width={100} height={100} />
      </div>

      <div>
        <h2 className="text-3xl font-extrabold text-center mb-2 text-white">
          ¡Excelente!
        </h2>

        <p className="text-xl font-semibold text-white text-center">
          {`Haz completado la etapa de ${title}.`}
        </p>
      </div>

      {showPrimary && (
        <div className="mt-6 w-full">
          <Button
            onClick={onPrimary}
            variant={"secondary"}
            className="w-full bg-white text-magent font-semibold h-12 text-lg"
          >
            {primaryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
