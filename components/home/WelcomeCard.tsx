"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useUserTasks } from "@/hooks/useUserTasks";
import { useRouter } from "next/navigation";
import { SkeletonLoader } from "../shared/SkeletonLoader";
import { Button } from "../ui/button";
import Image from "next/image";

export const WelcomeCard = () => {
  const { user } = useAuth();
  const { userTasks, loading, refetch } = useUserTasks(user?.sub);
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCompleteProfile = () => {
    router.push("/auth/questions");
  };

  return (
    <div className="bg-blue w-full relative flex flex-col justify-center rounded-xl p-3">
      <div className="absolute top-0 right-0 w-full h-full">
        <Image
          src="/brand/element.svg"
          alt="Oncoactivate Icon"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col w-full pl-5 relative z-10">
        <h2 className="inline-flex gap-2 text-white text-2xl">
          ¡Hola{" "}
          {loading ? (
            <SkeletonLoader width={128} height={28} />
          ) : (
            <span className="text-magent">
              {user?.user_metadata?.fullName}!
            </span>
          )}
        </h2>
        <h1 className="text-white text-4xl font-bold">Bienvenida</h1>
        {loading || !userTasks ? (
          <div className="mt-5">
            <SkeletonLoader width={300} height={32} />
          </div>
        ) : !userTasks.profileCompleted ? (
          <Button
            onClick={handleCompleteProfile}
            className="bg-magent px-7 py-1 rounded-full mt-5 self-start hover:bg-magent/90"
          >
            <span className="text-white font-semibold text-lg">
              Completar mi Perfil
            </span>
          </Button>
        ) : (
          <p className="text-white text-2xl font-semibold mt-5">
            Mantente activa y saludable día a día
          </p>
        )}
      </div>
    </div>
  );
};
