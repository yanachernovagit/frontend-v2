import api from "./api";
import authApi from "./authApi";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  SignInDto,
  SignUpDto,
  ChangePasswordDto,
  RequestResetPasswordDto,
  UpdatePasswordWithTokenDto,
  AuthSession,
} from "@/types/auth";

export async function signInService(
  data: SignInDto,
): Promise<AuthSession> {
  try {
    const response = await api.post(ENDPOINTS.AUTH.SIGNIN, data);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    let message = "No se pudo iniciar sesión.";

    if (status === 400) {
      message = "Solicitud inválida. Revisa tus datos.";
    } else if (status === 401) {
      message = "Correo o contraseña incorrectos.";
    } else if (status === 403) {
      message = "No tienes permiso para acceder.";
    } else if (status === 404) {
      message = "Usuario no encontrado.";
    } else if (status === 500) {
      message = "Error inesperado. Intenta nuevamente.";
    }

    throw new Error(message);
  }
}

export async function signUpService(data: SignUpDto): Promise<void> {
  try {
    const response = await api.post(ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    let message = "Ocurrió un error al registrarse.";

    if (status === 409) {
      message = "El correo ya está registrado.";
    } else if (status === 400) {
      message = "Datos inválidos. Revisa el formulario.";
    } else if (status === 500) {
      message = "Error interno del servidor. Intenta más tarde.";
    }
    throw new Error(message);
  }
}

export async function changePasswordService(
  data: ChangePasswordDto,
): Promise<void> {
  try {
    const response = await authApi.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    let message = "No se pudo cambiar la contraseña.";

    if (status === 400) {
      message = "Los datos enviados no son válidos.";
    } else if (status === 401) {
      message = "Contraseña actual es incorrecta.";
    } else if (status === 404) {
      message = "Usuario no encontrado.";
    } else if (status === 500) {
      message = "Error del servidor. Intenta más tarde.";
    }

    throw new Error(message);
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
  } catch (error: any) {
    const status = error?.response?.status;
    let message = "No se pudo enviar el correo de recuperación.";

    if (status === 404) {
      message = "Correo incorrecto.";
    } else if (status === 400) {
      message = "Correo inválido. Revisa el formato.";
    } else if (status === 500) {
      message = "Error del servidor. Intenta nuevamente más tarde.";
    }

    throw new Error(message);
  }
}

export async function updatePasswordWithTokenService(
  data: UpdatePasswordWithTokenDto,
): Promise<void> {
  try {
    await api.post(ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
  } catch (error: any) {
    const status = error?.response?.status;
    let message = "No se pudo actualizar la contraseña.";

    if (status === 400) {
      message = "El enlace es inválido o ha expirado.";
    } else if (status === 500) {
      message = "Error del servidor. Intenta nuevamente más tarde.";
    }

    throw new Error(message);
  }
}
