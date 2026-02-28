import authApi from "./authApi";
import { AdminUser, AdminUserDetail, PrescriptionHistoryItem } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.USERS.LIST);
    return response.data;
  } catch {
    throw new Error("No se pudieron obtener los usuarios.");
  }
}

export async function getAdminUserDetail(
  id: string,
): Promise<AdminUserDetail> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.USERS.GET(id));
    return response.data;
  } catch {
    throw new Error("No se pudo obtener el detalle del usuario.");
  }
}

export async function updateAdminUserRole(
  id: string,
  role: string,
): Promise<AdminUser> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.USERS.UPDATE_ROLE(id),
      { role },
    );
    return response.data;
  } catch {
    throw new Error("No se pudo actualizar el rol.");
  }
}

export async function updateAdminUserPlan(
  id: string,
  data: { phase?: number; stage?: number },
): Promise<void> {
  try {
    await authApi.patch(ADMIN_ENDPOINTS.USERS.UPDATE_PLAN(id), data);
  } catch {
    throw new Error("No se pudo actualizar el plan del usuario.");
  }
}

export async function resetAdminUserPassword(
  id: string,
  newPassword: string,
): Promise<void> {
  try {
    await authApi.post(ADMIN_ENDPOINTS.USERS.RESET_PASSWORD(id), {
      newPassword,
    });
  } catch {
    throw new Error("No se pudo resetear la contraseña.");
  }
}

export async function sendAdminUserResetEmail(id: string): Promise<void> {
  try {
    await authApi.post(ADMIN_ENDPOINTS.USERS.SEND_RESET_EMAIL(id));
  } catch {
    throw new Error("No se pudo enviar el email de recuperación.");
  }
}

export async function resetAdminUserPlan(id: string): Promise<void> {
  try {
    await authApi.post(ADMIN_ENDPOINTS.USERS.RESET_PLAN(id));
  } catch {
    throw new Error("No se pudo resetear el plan del usuario.");
  }
}

export async function deleteAdminUserPrescriptionCache(
  id: string,
): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.USERS.DELETE_PRESCRIPTION_CACHE(id));
  } catch {
    throw new Error("No se pudo limpiar el cache de prescripción.");
  }
}

export async function createAdminUserPlan(
  id: string,
  phase: number,
): Promise<AdminUserDetail> {
  try {
    const response = await authApi.post(
      ADMIN_ENDPOINTS.USERS.CREATE_PLAN(id),
      { phase },
    );
    return response.data;
  } catch {
    throw new Error("No se pudo crear el plan del usuario.");
  }
}

export async function updateAdminUserTasks(
  id: string,
  tasks: {
    profileCompleted?: boolean;
    firstEvaluationCompleted?: boolean;
    secondEvaluationCompleted?: boolean;
    dailyPlanCompleted?: boolean;
  },
): Promise<AdminUserDetail> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.USERS.UPDATE_TASKS(id),
      tasks,
    );
    return response.data;
  } catch {
    throw new Error("No se pudieron actualizar las tareas.");
  }
}

export async function setAdminUserFatigue(
  id: string,
  level: number,
): Promise<AdminUserDetail> {
  try {
    const response = await authApi.post(
      ADMIN_ENDPOINTS.USERS.SET_FATIGUE(id),
      { level },
    );
    return response.data;
  } catch {
    throw new Error("No se pudo registrar la fatiga.");
  }
}

export async function updateAdminUserPlanDetails(
  id: string,
  data: {
    currentWeek?: number;
    completedToday?: boolean;
    progressRoutine?: number;
    progressExercise?: number;
  },
): Promise<AdminUserDetail> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.USERS.UPDATE_PLAN_DETAILS(id),
      data,
    );
    return response.data;
  } catch {
    throw new Error("No se pudieron actualizar los detalles del plan.");
  }
}

export async function getAdminUserPrescriptions(
  id: string,
): Promise<{ prescriptions: PrescriptionHistoryItem[] }> {
  try {
    const response = await authApi.get(
      ADMIN_ENDPOINTS.USERS.PRESCRIPTIONS(id),
    );
    return response.data;
  } catch {
    throw new Error("No se pudo obtener el historial de prescripciones.");
  }
}

export async function toggleAdminUserDebug(
  id: string,
  debug: boolean,
): Promise<AdminUserDetail> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.USERS.TOGGLE_DEBUG(id),
      { debug },
    );
    return response.data;
  } catch {
    throw new Error("No se pudo cambiar el modo debug.");
  }
}
