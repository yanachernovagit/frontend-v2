"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES } from "@/constants/UserRoles";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoggedUserHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const isAdmin = user?.user_metadata?.role === USER_ROLES.ADMIN;

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <div className="flex items-center justify-between w-full rounded-xl p-2 bg-bg-secondary mb-4">
      <Image
        src="/brand/logotype-magent.svg"
        alt="Oncoactivate"
        width={170}
        height={50}
      />
      <div className="flex items-stretch justify-between gap-2 h-full">
        {isAdmin && (
          <Link href="/admin">
            <Button
              variant="outline"
              className="h-full px-4 border-magent text-magent hover:bg-magent hover:text-white"
            >
              Panel Admin
            </Button>
          </Link>
        )}
        <div className="flex items-center justify-between px-7 bg-magent text-white rounded-full text-sm">
          <CircleUserRound className="mr-2" size={18} />
          {user?.user_metadata.fullName ?? "Usuario"}
        </div>
        <Button
          variant="outline_magent"
          className="px-7"
          onClick={handleLogout}
        >
          Salir
        </Button>
      </div>
    </div>
  );
}
