import posthog from "posthog-js";
import type { PostHogConfig } from "posthog-js";

export const posthogNoCaptureProps = {
  "data-ph-no-capture": "true",
} as const;

export const posthogEnabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
);

const getBackendHost = (): string | null => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return null;

  try {
    return new URL(backendUrl).host;
  } catch {
    return null;
  }
};

type PostHogTracingConfig = Partial<PostHogConfig> & {
  __add_tracing_headers?: string[];
};

export const initPostHog = () => {
  if (typeof window === "undefined") return;

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!projectToken) return;

  const alreadyLoaded = (posthog as typeof posthog & { __loaded?: boolean })
    .__loaded;
  if (alreadyLoaded) return;

  const backendHost = getBackendHost();
  const config: PostHogTracingConfig = {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    defaults: "2026-01-30",
    capture_pageview: "history_change",
    autocapture: false,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "input, textarea, [data-ph-no-capture]",
      blockSelector: "[data-ph-no-capture]",
      recordHeaders: false,
      recordBody: false,
    },
    capture_performance: {
      network_timing: true,
      web_vitals: true,
    },
    ...(backendHost ? { __add_tracing_headers: [backendHost] } : {}),
  };

  posthog.init(projectToken, config);
};

export const captureFrontendException = (
  error: unknown,
  properties?: Record<string, unknown>,
) => {
  if (!posthogEnabled) return;
  posthog.captureException(error, properties);
};

export const captureFrontendEvent = (
  event: string,
  properties?: Record<string, unknown>,
) => {
  if (!posthogEnabled) return;
  posthog.capture(event, properties);
};

export const identifyPostHogUser = (
  userId: string,
  properties?: Record<string, unknown>,
) => {
  if (!posthogEnabled) return;
  posthog.identify(userId, properties);
};

export const resetPostHogUser = () => {
  if (!posthogEnabled) return;
  posthog.reset();
};
