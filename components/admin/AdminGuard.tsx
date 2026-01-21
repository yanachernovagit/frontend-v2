"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES } from "@/constants/UserRoles";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/signin");
        return;
      }

      const userRole = user?.user_metadata?.role;
      if (userRole !== USER_ROLES.ADMIN) {
        router.push("/inicio");
      }
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-white border-r-transparent" />
          <p className="mt-4 text-white">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.user_metadata?.role !== USER_ROLES.ADMIN) {
    return null;
  }

  return <>{children}</>;
}
