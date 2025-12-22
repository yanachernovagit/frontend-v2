import { UserPlan } from "@/types";
import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";

export async function getUserPlanService(userId: string): Promise<UserPlan> {
  try {
    const response = await authApi.get(ENDPOINTS.USER_PLAN.GET(userId));
    return response.data;
  } catch {
    throw new Error("No se pudo obtener tu plan de ejercicios.");
  }
}

export async function updateUserPlanProgressService(
  userId: string,
): Promise<UserPlan> {
  try {
    const response = await authApi.post(
      ENDPOINTS.USER_PLAN.UPDATE_EXERCISE(userId),
    );
    return response.data;
  } catch {
    throw new Error("No se pudo actualizar tu progreso en el plan.");
  }
}

export async function getCurrentExcerciseService(
  userId: string,
): Promise<boolean> {
  try {
    const response = await authApi.get(
      ENDPOINTS.USER_EXERCISE.CURRENT_BY_USER(userId),
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo obtener tu ejercicio actual.");
  }
}
