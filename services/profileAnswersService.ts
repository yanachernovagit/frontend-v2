import { ENDPOINTS } from "@/constants/endpoints";
import type { ProfileQuestionAnswer } from "@/types";
import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";

export async function saveProfileAnswerService(payload: ProfileQuestionAnswer) {
  try {
    const response = await authApi.post(
      ENDPOINTS.PROFILE_ANSWERS.CREATE,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo guardar la respuesta.",
      }),
    );
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
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudieron guardar las respuestas.",
      }),
    );
  }
}
