import authApi from "./authApi";
import { Evaluation } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAdminEvaluations(): Promise<Evaluation[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.EVALUATIONS.LIST);
    return response.data;
  } catch {
    throw new Error("No se pudieron obtener las evaluaciones.");
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
  } catch {
    throw new Error("No se pudo crear la evaluacion.");
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
  } catch {
    throw new Error("No se pudo actualizar la evaluacion.");
  }
}

export async function deleteAdminEvaluation(id: string): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.EVALUATIONS.DELETE(id));
  } catch {
    throw new Error("No se pudo eliminar la evaluacion.");
  }
}
