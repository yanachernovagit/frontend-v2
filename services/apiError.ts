import axios from "axios";

type ExtractApiErrorMessageOptions = {
  fallback: string;
  statusMessages?: Partial<Record<number, string>>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const normalizeMessage = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const message = value.trim();
  return message.length > 0 ? message : null;
};

const collectMessages = (value: unknown): string[] => {
  if (typeof value === "string") {
    return normalizeMessage(value) ? [value.trim()] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectMessages);
  }

  if (!isRecord(value)) {
    return [];
  }

  return [
    ...collectMessages(value.message),
    ...collectMessages(value.error),
    ...collectMessages(value.details),
  ];
};

const translateKnownApiMessage = (message: string): string => {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("already registered") ||
    normalized.includes("already been registered") ||
    normalized.includes("user already exists")
  ) {
    return "Este correo ya está registrado. Inicia sesión o recupera tu contraseña.";
  }

  if (
    normalized.includes("invalid email") ||
    normalized.includes("email address is invalid")
  ) {
    return "Ingresa un correo electrónico válido.";
  }

  if (
    normalized.includes("weak password") ||
    normalized.includes("password should") ||
    normalized.includes("password must") ||
    normalized.includes("password is too weak")
  ) {
    return "La contraseña no cumple los requisitos mínimos.";
  }

  if (
    normalized.includes("new password should be different") ||
    normalized.includes("same password")
  ) {
    return "La nueva contraseña debe ser distinta a la actual.";
  }

  if (
    normalized.includes("expired") ||
    normalized.includes("invalid token") ||
    normalized.includes("token is invalid") ||
    normalized.includes("invalid jwt") ||
    normalized.includes("link is invalid")
  ) {
    return "El enlace es inválido o ya expiró.";
  }

  return message;
};

export const extractApiErrorMessage = (
  error: unknown,
  { fallback, statusMessages }: ExtractApiErrorMessageOptions,
): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  if (error.code === "ECONNABORTED") {
    return "La solicitud tardó demasiado. Intenta nuevamente.";
  }

  if (!error.response) {
    return "No pudimos conectarnos con el servidor. Revisa tu conexión e inténtalo nuevamente.";
  }

  const status = error.response.status;
  const [payloadMessage] = collectMessages(error.response.data);

  if (payloadMessage) {
    return translateKnownApiMessage(payloadMessage);
  }

  if (statusMessages?.[status]) {
    return statusMessages[status]!;
  }

  return fallback;
};
