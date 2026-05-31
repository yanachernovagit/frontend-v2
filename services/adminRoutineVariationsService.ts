import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
import { RoutineVariation, CreateRoutineVariationPayload } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAdminRoutineVariations(): Promise<RoutineVariation[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.ROUTINE_VARIATIONS.LIST);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudieron obtener las variaciones de rutina.",
      }),
    );
  }
}

export async function createAdminRoutineVariation(
  data: CreateRoutineVariationPayload,
): Promise<RoutineVariation> {
  try {
    const response = await authApi.post(
      ADMIN_ENDPOINTS.ROUTINE_VARIATIONS.CREATE,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo crear la variación de rutina.",
      }),
    );
  }
}

export async function updateAdminRoutineVariation(
  id: string,
  data: CreateRoutineVariationPayload,
): Promise<RoutineVariation> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.ROUTINE_VARIATIONS.UPDATE(id),
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo actualizar la variación de rutina.",
      }),
    );
  }
}

export async function deleteAdminRoutineVariation(id: string): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.ROUTINE_VARIATIONS.DELETE(id));
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo eliminar la variación de rutina.",
      }),
    );
  }
}
