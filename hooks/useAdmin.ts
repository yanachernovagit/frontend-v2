import { USER_ROLES } from "@/constants/UserRoles";
import { useAuth } from "@/hooks/useAuth";

export function useAdmin() {
  const { user, loading, isAuthenticated } = useAuth();
  const isAdmin = user?.user_metadata?.role === USER_ROLES.ADMIN;

  return {
    isAdmin,
    loading,
    isAuthenticated,
  } as const;
}
