import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

import { captureFrontendEvent } from "@/lib/posthog";
import { createSupportCode } from "./supportCode";

declare module "axios" {
  export interface AxiosRequestConfig {
    _requestStartedAt?: number;
    _clientRequestId?: string;
  }

  export interface InternalAxiosRequestConfig {
    _requestStartedAt?: number;
    _clientRequestId?: string;
  }
}

type NetworkInformationLike = {
  effectiveType?: string;
  type?: string;
  downlink?: number;
  rtt?: number;
};

const UUID_SEGMENT_PATTERN =
  /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?=\/|$)/gi;
const LONG_NUMERIC_SEGMENT_PATTERN = /\/\d{5,}(?=\/|$)/g;

export const createClientRequestId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `web-${crypto.randomUUID()}`;
  }

  return `web-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
};

const normalizePath = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return (
    normalized
      .replace(UUID_SEGMENT_PATTERN, "/:id")
      .replace(LONG_NUMERIC_SEGMENT_PATTERN, "/:id")
      .replace(/\/{2,}/g, "/") || "unknown"
  );
};

const getRequestPath = (error: AxiosError): string => {
  const rawUrl = error.config?.url;
  if (!rawUrl) return "unknown";

  try {
    const parsedUrl = new URL(rawUrl, "https://oncoactivate.local");
    return normalizePath(parsedUrl.pathname);
  } catch {
    return normalizePath(rawUrl.split("?")[0] || "unknown");
  }
};

const getDurationMs = (error: AxiosError): number | null => {
  const startedAt = error.config?._requestStartedAt;
  if (!startedAt) return null;
  return Math.max(0, Date.now() - startedAt);
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

const getApiHost = (baseURL?: string): string | null => {
  if (!baseURL) return null;

  try {
    return new URL(baseURL).host;
  } catch {
    return null;
  }
};

const getBrowserNetworkContext = () => {
  if (typeof navigator === "undefined") {
    return {
      online: null,
      networkType: null,
      effectiveType: null,
      downlink: null,
      rtt: null,
    };
  }

  const connection = (
    navigator as Navigator & {
      connection?: NetworkInformationLike;
    }
  ).connection;

  return {
    online: navigator.onLine,
    networkType: connection?.type ?? null,
    effectiveType: connection?.effectiveType ?? null,
    downlink: connection?.downlink ?? null,
    rtt: connection?.rtt ?? null,
  };
};

const getBrowserContext = () => ({
  route:
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : null,
  environment: process.env.NODE_ENV ?? "development",
  platform: "web",
  ...getBrowserNetworkContext(),
});

const shouldCaptureApiFailure = (error: AxiosError): boolean => {
  const status = error.response?.status;
  if (!status) return true;
  return status === 408 || status >= 500;
};

export const captureApiFailure = (
  error: unknown,
  clientName: string,
  options: { force?: boolean; event?: string } = {},
) => {
  if (!axios.isAxiosError(error)) return;
  if (!options.force && !shouldCaptureApiFailure(error)) return;
  const requestId = getResponseHeader(error.response?.headers, "x-request-id");
  const clientRequestId = error.config?._clientRequestId ?? null;

  captureFrontendEvent(options.event ?? "api_request_failed", {
    clientName,
    method: error.config?.method?.toUpperCase() ?? "UNKNOWN",
    path: getRequestPath(error),
    apiHost: getApiHost(error.config?.baseURL),
    status: error.response?.status ?? null,
    axiosCode: error.code ?? null,
    hasResponse: Boolean(error.response),
    errorMessage: error.message || null,
    requestId,
    clientRequestId,
    supportCode: createSupportCode(requestId ?? clientRequestId),
    cfRay: getResponseHeader(error.response?.headers, "cf-ray"),
    durationMs: getDurationMs(error),
    ...getBrowserContext(),
  });
};

export const captureAuthFlowFailure = (flow: string, error: unknown) => {
  if (axios.isAxiosError(error)) {
    const requestId = getResponseHeader(
      error.response?.headers,
      "x-request-id",
    );
    const clientRequestId = error.config?._clientRequestId ?? null;
    captureFrontendEvent("auth_flow_failed", {
      flow,
      clientName: "publicApi",
      method: error.config?.method?.toUpperCase() ?? "UNKNOWN",
      path: getRequestPath(error),
      apiHost: getApiHost(error.config?.baseURL),
      status: error.response?.status ?? null,
      axiosCode: error.code ?? null,
      hasResponse: Boolean(error.response),
      errorMessage: error.message || null,
      requestId,
      clientRequestId,
      supportCode: createSupportCode(requestId ?? clientRequestId),
      cfRay: getResponseHeader(error.response?.headers, "cf-ray"),
      durationMs: getDurationMs(error),
      ...getBrowserContext(),
    });
    return;
  }

  captureFrontendEvent("auth_flow_failed", {
    flow,
    errorMessage: error instanceof Error ? error.message : String(error),
    ...getBrowserContext(),
  });
};

export const installHttpDiagnostics = (
  instance: AxiosInstance,
  clientName: string,
) => {
  instance.interceptors.request.use((config) => {
    config._requestStartedAt = Date.now();
    config._clientRequestId =
      config._clientRequestId ?? createClientRequestId();

    const headers = AxiosHeaders.from(config.headers);
    headers.set("x-client-request-id", config._clientRequestId);
    config.headers = headers;

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      captureApiFailure(error, clientName);
      return Promise.reject(error);
    },
  );
};
