import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
import { ENDPOINTS } from "@/constants/endpoints";
import { RecordFatigueDto } from "@/types";
import { FatigueLevelEnum } from "@/constants/enums";

export type DailyFeelingValue = FatigueLevelEnum;

export async function submitPlanFeelingService(feeling: DailyFeelingValue) {
  const payload: RecordFatigueDto = { level: feeling };
  try {
    const response = await authApi.post(ENDPOINTS.USER_PLAN.FATIGUE, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo guardar cómo te sentiste hoy.",
      }),
    );
  }
}
