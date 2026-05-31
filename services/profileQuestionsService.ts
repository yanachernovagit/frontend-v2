import { ProfileQuestion } from "@/types";
import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
import { ENDPOINTS } from "@/constants/endpoints";

export async function getProfileService(): Promise<ProfileQuestion[]> {
  try {
    const response = await authApi.get(ENDPOINTS.PROFILE_QUESTIONS.LIST);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo obtener las preguntas.",
      }),
    );
  }
}
