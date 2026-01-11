import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";
import { UserStep } from "@/types/user-step";

export async function getDailyStepsService(
  period: number,
): Promise<UserStep[]> {
  try {
    const response = await authApi.get(ENDPOINTS.STEPS.BY_PERIOD(period));
    return response.data.data || [];
  } catch {
    throw new Error("No se pudieron obtener tus pasos diarios.");
  }
}

export async function postDailyStepsService(steps: number): Promise<void> {
  try {
    const response = await authApi.post(ENDPOINTS.STEPS.CREATE, {
      steps,
    });
    return response.data;
  } catch {
    throw new Error("No se pudieron registrar tus pasos diarios.");
  }
}
