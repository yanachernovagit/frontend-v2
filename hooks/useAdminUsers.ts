import { useCallback, useEffect, useState } from "react";

import { AdminUser } from "@/types";
import {
  getAdminUsers,
  updateAdminUserRole,
} from "@/services/adminUsersService";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (id: string, role: string) => {
    const updated = await updateAdminUserRole(id, role);
    setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
    return updated;
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUserRole,
  };
}
