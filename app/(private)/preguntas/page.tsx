"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ProfileQuestions } from "@/components/questions";
import { Button } from "@/components/ui/button";
import ConfettiIcon from "@/public/icons/white/Confetti.svg";

export default function QuestionsPage() {
  const router = useRouter();
  const [showProfileQuestions, setShowProfileQuestions] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setShowProfileQuestions(true);
  };

  const handleSkip = () => {
    router.replace("/inicio");
  };

  const handleProfileComplete = () => {
    setIsCompleted(true);
  };

  const handleFinish = () => {
    router.replace("/inicio");
  };

  if (isCompleted) {
    return (
      <AuthGuard>
        <div className="h-full bg-magent px-5 py-6 rounded-lg">
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-between">
            <Image
              src="/brand/imagotype-white.png"
              alt="Oncoactive"
              width={220}
              height={68}
              className="h-16 w-auto"
              priority
            />

            <div className="flex w-full max-w-2xl flex-col items-center">
              <Image src={ConfettiIcon} alt="Confetti" width={96} height={96} />
              <h1 className="mb-2 mt-8 w-full text-center text-3xl font-bold text-white md:text-4xl">
                Perfil completado con exito
              </h1>
              <p className="mb-2 w-full text-center text-base text-white/95 md:text-lg">
                Ya registramos tu informacion de perfil. Con esto podremos
                personalizar mejor tu experiencia en Oncoactive.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleFinish}
              variant="outline"
              className="border-white px-14 text-white hover:bg-white/10 hover:text-white"
            >
              Finalizar
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (showProfileQuestions) {
    return (
      <AuthGuard>
        <ProfileQuestions
          updateTasks={() => {}}
          onComplete={handleProfileComplete}
        />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-magent px-5 pt-8 rounded-lg">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col items-center justify-between">
          <Image
            src="/brand/imagotype-white.png"
            alt="Oncoactive"
            width={260}
            height={80}
            className="h-20 w-auto"
            priority
          />

          <h1 className="w-full max-w-3xl text-center text-3xl font-bold text-white md:text-5xl">
            Antes de comenzar, completa tu perfil
          </h1>

          <p className="w-full max-w-2xl text-center text-lg text-white/95 md:text-xl">
            Te tomara solo unos minutos y nos ayudara a adaptar mejor tu plan.
          </p>

          <Button
            type="button"
            onClick={handleComplete}
            variant="outline"
            className="mb-20 border-white px-16 text-white hover:bg-white/10 hover:text-white"
          >
            Completar
          </Button>

          <div className="flex items-center justify-center pb-8 text-white">
            <button type="button" onClick={handleSkip} className="text-base">
              Responder en otro momento
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="ml-4 text-base font-bold"
            >
              Saltar
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
