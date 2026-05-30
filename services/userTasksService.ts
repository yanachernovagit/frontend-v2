import { UserTasksStatus } from "@/types";
import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";

const EMPTY_USER_TASKS_STATUS: UserTasksStatus = {
  id: "empty",
  userId: "empty",
  profileCompleted: false,
  firstEvaluationCompleted: false,
  secondEvaluationCompleted: false,
  dailyPlanCompleted: false,
  createdAt: "",
  updatedAt: "",
};

export async function getUserTasksService(): Promise<UserTasksStatus | null> {
  try {
    const response = await authApi.get(ENDPOINTS.USER_TASKS.GET);
    if (!response.data) {
      return EMPTY_USER_TASKS_STATUS;
    }

    if (typeof response.data === "string" && response.data.trim() === "") {
      return EMPTY_USER_TASKS_STATUS;
    }

    return response.data as UserTasksStatus;
  } catch {
    throw new Error("No se pudo obtener las tareas.");
  }
}
