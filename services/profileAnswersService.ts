import { ENDPOINTS } from "@/constants/endpoints";
import type { ProfileQuestionAnswer } from "@/types";
import authApi from "./authApi";

export async function saveProfileAnswerService(payload: ProfileQuestionAnswer) {
  try {
    const response = await authApi.post(
      ENDPOINTS.PROFILE_ANSWERS.CREATE,
      payload,
    );
    return response.data;
  } catch {
    throw new Error("No se pudo guardar la respuesta.");
  }
}

export async function saveAllProfileAnswersService(
  payload: ProfileQuestionAnswer[],
) {
  try {
    const response = await authApi.post(ENDPOINTS.PROFILE_ANSWERS.CREATE_BULK, {
      answers: payload,
    });
    return response.data;
  } catch (error) {
    throw new Error("No se pudieron guardar las respuestas.");
  }
}
