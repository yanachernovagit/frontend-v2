import { UserTasksStatus } from "@/types";
import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";

export async function getUserTasksService(): Promise<UserTasksStatus | null> {
  try {
    const response = await authApi.get(ENDPOINTS.USER_TASKS.GET);
    if (!response.data) {
      return null;
    }

    return response.data as UserTasksStatus;
  } catch {
    throw new Error("No se pudo obtener las tareas.");
  }
}
