import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
import { RoutineCatalog } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAdminRoutines(): Promise<RoutineCatalog[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.ROUTINES.LIST);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudieron obtener las rutinas.",
      }),
    );
  }
}

export async function createAdminRoutine(
  data: Omit<RoutineCatalog, "id">,
): Promise<RoutineCatalog> {
  try {
    const response = await authApi.post(ADMIN_ENDPOINTS.ROUTINES.CREATE, data);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo crear la rutina.",
      }),
    );
  }
}

export async function updateAdminRoutine(
  id: string,
  data: Partial<RoutineCatalog>,
): Promise<RoutineCatalog> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.ROUTINES.UPDATE(id),
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo actualizar la rutina.",
      }),
    );
  }
}

export async function deleteAdminRoutine(id: string): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.ROUTINES.DELETE(id));
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo eliminar la rutina.",
      }),
    );
  }
}
