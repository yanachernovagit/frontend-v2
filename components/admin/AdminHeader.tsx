"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const pathLabels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/evaluations": "Evaluaciones",
  "/admin/exercises": "Ejercicios",
  "/admin/routines": "Rutinas",
  "/admin/questions": "Preguntas",
  "/admin/users": "Usuarios",
};

export function AdminHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const currentLabel = pathLabels[pathname] || "Dashboard";
  const userName = user?.user_metadata?.fullName || "Administrador";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between mb-6 pb-6 border-b">
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-4">
        <Image
          src="/brand/logotype-magent.svg"
          alt="Oncoactivate"
          width={120}
          height={30}
        />
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Inicio</span>
          {pathname !== "/admin" && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{currentLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium">{userName}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-magent flex items-center justify-center text-white text-sm font-bold">
          {userInitials}
        </div>
      </div>
    </div>
  );
}
