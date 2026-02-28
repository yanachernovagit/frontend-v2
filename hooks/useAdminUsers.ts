import { useCallback, useEffect, useState } from "react";

import { AdminUser, AdminUserDetail, PrescriptionHistoryItem } from "@/types";
import {
  getAdminUsers,
  getAdminUserDetail,
  updateAdminUserRole,
  updateAdminUserPlan,
  resetAdminUserPassword,
  sendAdminUserResetEmail,
  resetAdminUserPlan,
  deleteAdminUserPrescriptionCache,
  createAdminUserPlan,
  updateAdminUserTasks,
  setAdminUserFatigue,
  updateAdminUserPlanDetails,
  getAdminUserPrescriptions,
  toggleAdminUserDebug,
} from "@/services/adminUsersService";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userDetail, setUserDetail] = useState<AdminUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [prescriptions, setPrescriptions] = useState<
    PrescriptionHistoryItem[]
  >([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar usuarios",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUserDetail = async (id: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const data = await getAdminUserDetail(id);
      setUserDetail(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar detalle del usuario",
      );
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    setError(null);
    try {
      const updated = await updateAdminUserRole(id, role);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updated : user)),
      );
      return updated;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar rol del usuario",
      );
      throw err;
    }
  };

  const updateUserPlan = async (
    id: string,
    data: { phase?: number; stage?: number },
  ) => {
    setError(null);
    try {
      await updateAdminUserPlan(id, data);
      await fetchUserDetail(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar plan del usuario",
      );
      throw err;
    }
  };

  const resetPassword = async (id: string, newPassword: string) => {
    setError(null);
    try {
      await resetAdminUserPassword(id, newPassword);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al resetear contraseña",
      );
      throw err;
    }
  };

  const sendResetEmail = async (id: string) => {
    setError(null);
    try {
      await sendAdminUserResetEmail(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al enviar email de recuperación",
      );
      throw err;
    }
  };

  const resetPlan = async (id: string) => {
    setError(null);
    try {
      await resetAdminUserPlan(id);
      await fetchUserDetail(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al resetear plan del usuario",
      );
      throw err;
    }
  };

  const deletePrescriptionCache = async (id: string) => {
    setError(null);
    try {
      await deleteAdminUserPrescriptionCache(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al limpiar cache de prescripción",
      );
      throw err;
    }
  };

  const createPlan = async (id: string, phase: number) => {
    setError(null);
    try {
      const detail = await createAdminUserPlan(id, phase);
      setUserDetail(detail);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el plan",
      );
      throw err;
    }
  };

  const updateTasks = async (
    id: string,
    tasks: {
      profileCompleted?: boolean;
      firstEvaluationCompleted?: boolean;
      secondEvaluationCompleted?: boolean;
      dailyPlanCompleted?: boolean;
    },
  ) => {
    setError(null);
    try {
      const detail = await updateAdminUserTasks(id, tasks);
      setUserDetail(detail);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar las tareas",
      );
      throw err;
    }
  };

  const setFatigue = async (id: string, level: number) => {
    setError(null);
    try {
      const detail = await setAdminUserFatigue(id, level);
      setUserDetail(detail);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar fatiga",
      );
      throw err;
    }
  };

  const updatePlanDetails = async (
    id: string,
    data: {
      currentWeek?: number;
      completedToday?: boolean;
      progressRoutine?: number;
      progressExercise?: number;
    },
  ) => {
    setError(null);
    try {
      const detail = await updateAdminUserPlanDetails(id, data);
      setUserDetail(detail);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar detalles del plan",
      );
      throw err;
    }
  };

  const fetchPrescriptions = async (id: string) => {
    setPrescriptionsLoading(true);
    try {
      const data = await getAdminUserPrescriptions(id);
      setPrescriptions(data.prescriptions);
    } catch (err) {
      setPrescriptions([]);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar historial de prescripciones",
      );
    } finally {
      setPrescriptionsLoading(false);
    }
  };

  const toggleDebug = async (id: string, debug: boolean) => {
    setError(null);
    try {
      const detail = await toggleAdminUserDebug(id, debug);
      setUserDetail(detail);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, debug } : u)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cambiar modo debug",
      );
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUserRole,

    userDetail,
    detailLoading,
    fetchUserDetail,
    clearUserDetail: () => {
      setUserDetail(null);
      setPrescriptions([]);
    },

    updateUserPlan,
    resetPassword,
    sendResetEmail,
    resetPlan,
    deletePrescriptionCache,

    createPlan,
    updateTasks,
    setFatigue,
    updatePlanDetails,
    toggleDebug,

    prescriptions,
    prescriptionsLoading,
    fetchPrescriptions,
  };
}
