import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";

export async function uploadProfilePicture(
  file: File,
): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await authApi.post<{ url: string }>(
      ENDPOINTS.PROFILE.PICTURE,
      formData,
    );
    return response.data;
  } catch {
    throw new Error("No se pudo subir la foto de perfil.");
  }
}
