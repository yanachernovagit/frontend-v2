import authApi from "./authApi";
import { ProfileQuestion } from "@/types";
import { ADMIN_ENDPOINTS } from "@/constants/adminEndpoints";

export async function getAdminQuestions(): Promise<ProfileQuestion[]> {
  try {
    const response = await authApi.get(ADMIN_ENDPOINTS.QUESTIONS.LIST);
    return response.data;
  } catch {
    throw new Error("No se pudieron obtener las preguntas.");
  }
}

export async function createAdminQuestion(
  data: Partial<ProfileQuestion>,
): Promise<ProfileQuestion> {
  try {
    const response = await authApi.post(ADMIN_ENDPOINTS.QUESTIONS.CREATE, data);
    return response.data;
  } catch {
    throw new Error("No se pudo crear la pregunta.");
  }
}

export async function updateAdminQuestion(
  id: string,
  data: Partial<ProfileQuestion>,
): Promise<ProfileQuestion> {
  try {
    const response = await authApi.patch(
      ADMIN_ENDPOINTS.QUESTIONS.UPDATE(id),
      data,
    );
    return response.data;
  } catch {
    throw new Error("No se pudo actualizar la pregunta.");
  }
}

export async function deleteAdminQuestion(id: string): Promise<void> {
  try {
    await authApi.delete(ADMIN_ENDPOINTS.QUESTIONS.DELETE(id));
  } catch {
    throw new Error("No se pudo eliminar la pregunta.");
  }
}
