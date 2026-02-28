"use client";

import Image from "next/image";
import { User } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export function ProfileCard() {
  const { user } = useAuth();

  const profilePicture =
    user && typeof user.profilePictureRef === "string"
      ? user.profilePictureRef
      : null;

  const fullName =
    typeof user?.user_metadata?.fullName === "string"
      ? user.user_metadata.fullName
      : "Usuario";

  return (
    <section className="relative flex w-full items-center justify-between overflow-hidden rounded-3xl bg-blue px-6 py-4">
      <div className="flex-1">
        <p className="mb-0.5 text-sm font-semibold text-magent-400">
          Mi perfil
        </p>
        <h1 className="text-2xl font-bold text-white">{fullName}</h1>
      </div>

      <div className="flex items-center justify-center">
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt={`Foto de perfil de ${fullName}`}
            width={64}
            height={64}
            unoptimized
            className="h-16 w-16 rounded-full border-2 border-white/20 object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-white/10">
            <User className="h-8 w-8 text-white" strokeWidth={2.2} />
          </div>
        )}
      </div>
    </section>
  );
}
