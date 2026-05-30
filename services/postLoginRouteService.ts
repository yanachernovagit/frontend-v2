import { getUserTasksService } from "@/services/userTasksService";

const PROFILE_QUESTIONS_SKIPPED_KEY_PREFIX = "profile_questions_skipped:";

function decodeUserIdFromToken(token: string | null): string | null {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(window.atob(padded)) as { sub?: unknown };
    return typeof decoded.sub === "string" ? decoded.sub : null;
  } catch {
    return null;
  }
}

function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return decodeUserIdFromToken(localStorage.getItem("auth_token"));
}

function getSkippedKey(userId?: string | null): string | null {
  const resolvedUserId = userId ?? getCurrentUserId();
  if (!resolvedUserId) return null;
  return `${PROFILE_QUESTIONS_SKIPPED_KEY_PREFIX}${resolvedUserId}`;
}

export function hasProfileQuestionsSkipped(userId?: string | null): boolean {
  if (typeof window === "undefined") return false;
  const key = getSkippedKey(userId);
  return key ? localStorage.getItem(key) === "true" : false;
}

export function markProfileQuestionsSkipped(userId?: string | null): void {
  if (typeof window === "undefined") return;
  const key = getSkippedKey(userId);
  if (key) localStorage.setItem(key, "true");
}

export function clearProfileQuestionsSkipped(userId?: string | null): void {
  if (typeof window === "undefined") return;
  const key = getSkippedKey(userId);
  if (key) localStorage.removeItem(key);
}

export async function getPostLoginPath(): Promise<"/inicio" | "/preguntas"> {
  try {
    const tasks = await getUserTasksService();
    if (tasks?.profileCompleted) return "/inicio";
    const userId = tasks?.userId === "empty" ? null : tasks?.userId;
    return hasProfileQuestionsSkipped(userId) ? "/inicio" : "/preguntas";
  } catch {
    return "/inicio";
  }
}
