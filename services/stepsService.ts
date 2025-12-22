import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";

export async function getDailyStepsService(
  userId: string,
  period: string,
): Promise<number> {
  try {
    const response = await authApi.get(
      ENDPOINTS.STEPS.BY_USER_PERIOD(userId, period),
    );
    return response.data.data[0]?.steps || 0;
  } catch {
    throw new Error("No se pudieron obtener tus pasos diarios.");
  }
}

export async function postDailyStepsService(
  userId: string,
  steps: number,
): Promise<void> {
  try {
    const response = await authApi.post(ENDPOINTS.STEPS.CREATE, {
      userId,
      steps,
    });
    return response.data;
  } catch {
    throw new Error("No se pudieron registrar tus pasos diarios.");
  }
}
