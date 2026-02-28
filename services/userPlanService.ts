import { ChangePlanPhaseDto, UserPlan } from "@/types";
import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";

export async function getUserPlanService(): Promise<UserPlan> {
  try {
    const response = await authApi.get(ENDPOINTS.USER_PLAN.GET);
    return response.data;
  } catch {
    throw new Error("No se pudo obtener tu plan de ejercicios.");
  }
}

export async function updateUserPlanProgressService(): Promise<UserPlan> {
  try {
    const response = await authApi.post(ENDPOINTS.USER_PLAN.UPDATE_EXERCISE);
    return response.data;
  } catch {
    throw new Error("No se pudo actualizar tu progreso en el plan.");
  }
}

export async function changePlanPhaseService(
  data: ChangePlanPhaseDto,
): Promise<UserPlan> {
  try {
    const response = await authApi.patch(
      ENDPOINTS.USER_PLAN.UPDATE_PHASE,
      data,
    );
    return response.data;
  } catch {
    throw new Error("No se pudo actualizar la fase del plan.");
  }
}
