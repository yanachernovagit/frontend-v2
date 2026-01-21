import authApi from "./authApi";
import { ExerciseCatalog } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAdminExercises(): Promise<ExerciseCatalog[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.EXERCISES.LIST);
    return response.data;
  } catch {
    throw new Error("No se pudieron obtener los ejercicios.");
  }
}

export async function createAdminExercise(
  data: Omit<ExerciseCatalog, "id">,
): Promise<ExerciseCatalog> {
  try {
    const response = await authApi.post(ADMIN_ENDPOINTS.EXERCISES.CREATE, data);
    return response.data;
  } catch {
    throw new Error("No se pudo crear el ejercicio.");
  }
}

export async function updateAdminExercise(
  id: string,
  data: Partial<ExerciseCatalog>,
): Promise<ExerciseCatalog> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.EXERCISES.UPDATE(id),
      data,
    );
    return response.data;
  } catch {
    throw new Error("No se pudo actualizar el ejercicio.");
  }
}

export async function deleteAdminExercise(id: string): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.EXERCISES.DELETE(id));
  } catch {
    throw new Error("No se pudo eliminar el ejercicio.");
  }
}
