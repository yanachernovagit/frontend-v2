"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function LoggedUserHeader() {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-between w-full rounded-xl p-2 bg-bg-secondary mb-4">
      <Image
        src="/brand/logotype-magent.svg"
        alt="Oncoactivate"
        width={170}
        height={50}
      />
      <div className="flex items-stretch justify-between gap-2 h-full">
        <div className="flex items-center justify-between px-7 bg-magent text-white rounded-full text-sm">
          <CircleUserRound className="mr-2" size={18} />
          {user?.user_metadata.fullName ?? "Usuario"}
        </div>
        <Button variant="outline_magent" className="px-7 ">
          Salir
        </Button>
      </div>
    </div>
  );
}
