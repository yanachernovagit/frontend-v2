import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
import { AIConfig, AIStats } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAIConfig(): Promise<AIConfig> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.AI.CONFIG);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo obtener la configuración de IA.",
      }),
    );
  }
}

export async function updateAIConfig(
  data: Partial<Omit<AIConfig, "provider" | "model">>,
): Promise<AIConfig> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.AI.UPDATE_CONFIG,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo actualizar la configuración de IA.",
      }),
    );
  }
}

export async function getAIStats(): Promise<AIStats> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.AI.STATS);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudieron obtener las estadísticas de IA.",
      }),
    );
  }
}
