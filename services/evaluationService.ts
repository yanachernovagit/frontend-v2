import { ENDPOINTS } from "@/constants/endpoints";
import {
  CompletedUserEvaluation,
  CompleteEvaluationDto,
  GroupedUserEvaluations,
} from "@/types";
import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";

export async function getUserEvaluationsService(): Promise<GroupedUserEvaluations> {
  try {
    const response = await authApi.get(ENDPOINTS.EVALUATIONS.USER_LIST);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudieron obtener tus evaluaciones.",
      }),
    );
  }
}

export async function completeUserEvaluationService(
  data: CompleteEvaluationDto,
): Promise<CompletedUserEvaluation> {
  try {
    const response = await authApi.post(ENDPOINTS.EVALUATIONS.COMPLETE, data);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo completar la evaluación.",
      }),
    );
  }
}
