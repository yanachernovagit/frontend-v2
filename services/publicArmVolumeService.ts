import api from "./api";
import { extractApiErrorMessage } from "./apiError";
import { ENDPOINTS } from "@/constants/endpoints";

type ArmVolumePayload = Record<string, string>;

type ArmVolumeResponse = {
  difference?: number | string;
  leftVolume?: number | string;
  rightVolume?: number | string;
} & Record<string, unknown>;

export async function submitPublicArmVolumeService(
  payload: ArmVolumePayload,
): Promise<ArmVolumeResponse> {
  const numericPayload = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      Number(value.replace(/,/g, ".")),
    ]),
  );

  try {
    const response = await api.post(
      ENDPOINTS.PUBLIC.ARM_VOLUME,
      numericPayload,
    );
    return response.data ?? {};
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudieron enviar los resultados.",
      }),
    );
  }
}

export async function getPublicArmVolumeService(): Promise<{
  videoUrl: string | null;
}> {
  try {
    const response = await api.get(ENDPOINTS.PUBLIC.ARM_VOLUME_VIDEO);
    return response.data ?? {};
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo cargar el video de evaluación.",
      }),
    );
  }
}
