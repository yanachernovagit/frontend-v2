import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
import { Evaluation } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAdminEvaluations(): Promise<Evaluation[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.EVALUATIONS.LIST);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudieron obtener las evaluaciones.",
      }),
    );
  }
}

export async function createAdminEvaluation(
  data: Omit<Evaluation, "id" | "createdAt" | "updatedAt">,
): Promise<Evaluation> {
  try {
    const response = await authApi.post(
      ADMIN_ENDPOINTS.EVALUATIONS.CREATE,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo crear la evaluación.",
      }),
    );
  }
}

export async function updateAdminEvaluation(
  id: string,
  data: Partial<Evaluation>,
): Promise<Evaluation> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.EVALUATIONS.UPDATE(id),
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo actualizar la evaluación.",
      }),
    );
  }
}

export async function deleteAdminEvaluation(id: string): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.EVALUATIONS.DELETE(id));
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo eliminar la evaluación.",
      }),
    );
  }
}
