"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, User } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { uploadProfilePicture } from "@/services/profileService";

export function ProfileCard() {
  const { user, refreshSession } = useAuth();

  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof user?.user_metadata?.profilePictureRef === "string") {
      setPictureUrl(user.user_metadata.profilePictureRef);
    }
  }, [user]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName =
    typeof user?.user_metadata?.fullName === "string"
      ? user.user_metadata.fullName
      : "Usuario";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const { url } = await uploadProfilePicture(file);
      setPictureUrl(url);
      await refreshSession();
    } catch {
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <section className="relative flex w-full items-center justify-between overflow-hidden rounded-3xl bg-blue px-6 py-4">
      <div className="flex-1">
        <p className="mb-0.5 text-sm font-semibold text-magent-400">
          Mi perfil
        </p>
        <h1 className="text-2xl font-bold text-white">{fullName}</h1>
      </div>

      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="group relative h-16 w-16 rounded-full focus:outline-none"
          aria-label="Cambiar foto de perfil"
        >
          {pictureUrl ? (
            <Image
              src={pictureUrl}
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

          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}
