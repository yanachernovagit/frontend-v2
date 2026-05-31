import axios from "axios";
import type { AxiosResponse } from "axios";
import { appendSupportCode, createSupportCode } from "./supportCode";

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

const getRecordString = (
  value: unknown,
  key: "requestId" | "supportCode",
): string | null => {
  if (!isRecord(value)) return null;
  const item = value[key];
  return typeof item === "string" && item.trim() ? item.trim() : null;
};

const getResponseHeader = (
  headers: AxiosResponse["headers"] | Record<string, unknown> | undefined,
  name: string,
): string | null => {
  if (!headers) return null;
  const normalizedName = name.toLowerCase();

  if (typeof (headers as { get?: unknown }).get === "function") {
    const value = (headers as { get: (key: string) => unknown }).get(name);
    return typeof value === "string" ? value : null;
  }

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== normalizedName) continue;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.join(",");
    if (value != null) return String(value);
  }

  return null;
};

export const getApiSupportCode = (error: unknown): string | null => {
  if (!axios.isAxiosError(error)) return null;

  const responseSupportCode = getRecordString(
    error.response?.data,
    "supportCode",
  );
  if (responseSupportCode) return responseSupportCode;

  const requestId =
    getRecordString(error.response?.data, "requestId") ??
    getResponseHeader(error.response?.headers, "x-request-id");
  const clientRequestId =
    getResponseHeader(error.response?.headers, "x-client-request-id") ??
    error.config?._clientRequestId;

  return createSupportCode(requestId ?? clientRequestId ?? null);
};

const shouldShowSupportCode = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  return (
    error.code === "ECONNABORTED" ||
    !error.response ||
    status === 408 ||
    (typeof status === "number" && status >= 500)
  );
};

const withSupportCode = (message: string, error: unknown): string => {
  if (!shouldShowSupportCode(error)) return message;
  return appendSupportCode(message, getApiSupportCode(error));
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
    return withSupportCode(
      "La solicitud tardó demasiado. Intenta nuevamente.",
      error,
    );
  }

  if (!error.response) {
    return withSupportCode(
      "No pudimos conectarnos con el servidor. Revisa tu conexión e inténtalo nuevamente.",
      error,
    );
  }

  const status = error.response.status;
  const [payloadMessage] = collectMessages(error.response.data);

  if (payloadMessage) {
    return withSupportCode(translateKnownApiMessage(payloadMessage), error);
  }

  if (statusMessages?.[status]) {
    return withSupportCode(statusMessages[status]!, error);
  }

  return withSupportCode(fallback, error);
};
