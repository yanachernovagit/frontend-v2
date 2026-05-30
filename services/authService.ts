import api from "./api";
import authApi from "./authApi";
import { extractApiErrorMessage } from "./apiError";
import { captureAuthFlowFailure } from "./httpDiagnostics";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  SignInDto,
  SignUpDto,
  ChangePasswordDto,
  RequestResetPasswordDto,
  UpdatePasswordWithTokenDto,
  AuthSession,
} from "@/types/auth";

export async function signInService(data: SignInDto): Promise<AuthSession> {
  try {
    const response = await api.post(ENDPOINTS.AUTH.SIGNIN, data);
    return response.data;
  } catch (error: unknown) {
    captureAuthFlowFailure("sign_in", error);
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo iniciar sesión.",
        statusMessages: {
          400: "Solicitud inválida. Revisa tus datos.",
          401: "Correo o contraseña incorrectos.",
          403: "No tienes permiso para acceder.",
          404: "Usuario no encontrado.",
          500: "Error inesperado. Intenta nuevamente.",
        },
      }),
    );
  }
}

export async function signUpService(data: SignUpDto): Promise<void> {
  try {
    const response = await api.post(ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  } catch (error: unknown) {
    captureAuthFlowFailure("sign_up", error);
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "Ocurrió un error al registrarse.",
        statusMessages: {
          400: "Datos inválidos. Revisa el formulario.",
          409: "El correo ya está registrado.",
          500: "Error interno del servidor. Intenta más tarde.",
        },
      }),
    );
  }
}

export async function changePasswordService(
  data: ChangePasswordDto,
): Promise<void> {
  try {
    const response = await authApi.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  } catch (error: unknown) {
    captureAuthFlowFailure("change_password", error);
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo cambiar la contraseña.",
        statusMessages: {
          400: "Los datos enviados no son válidos.",
          401: "La contraseña actual es incorrecta.",
          404: "Usuario no encontrado.",
          500: "Error del servidor. Intenta más tarde.",
        },
      }),
    );
  }
}

export async function requestResetPasswordService(
  data: RequestResetPasswordDto,
): Promise<void> {
  try {
    const response = await api.post(
      ENDPOINTS.AUTH.REQUEST_RESET_PASSWORD,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    captureAuthFlowFailure("request_reset_password", error);
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo enviar el correo de recuperación.",
        statusMessages: {
          400: "Correo inválido. Revisa el formato.",
          404: "Servicio no disponible. Intenta más tarde.",
          500: "Error del servidor. Intenta nuevamente más tarde.",
        },
      }),
    );
  }
}

export async function updatePasswordWithTokenService(
  data: UpdatePasswordWithTokenDto,
): Promise<void> {
  try {
    await api.post(ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
  } catch (error: unknown) {
    captureAuthFlowFailure("update_password", error);
    throw new Error(
      extractApiErrorMessage(error, {
        fallback: "No se pudo actualizar la contraseña.",
        statusMessages: {
          400: "El enlace es inválido o ha expirado.",
          500: "Error del servidor. Intenta nuevamente más tarde.",
        },
      }),
    );
  }
}

export async function refreshSessionService(
  refreshToken: string,
): Promise<AuthSession> {
  try {
    const response = await api.post<AuthSession>(ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    if (!response.data?.accessToken)
      throw new Error("Invalid refresh response");
    return response.data;
  } catch (error: unknown) {
    captureAuthFlowFailure("refresh_session", error);
    throw new Error("No se pudo refrescar la sesión.");
  }
}
