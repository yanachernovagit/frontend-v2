import { useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { identifyPostHogUser, resetPostHogUser } from "@/lib/posthog";
import { refreshSessionService } from "@/services/authService";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type AuthListener = (token: string | null) => void;
const authListeners = new Set<AuthListener>();

export const AuthEvents = {
  subscribe: (listener: AuthListener) => {
    authListeners.add(listener);
    return () => {
      authListeners.delete(listener);
    };
  },
  emit: (token: string | null) => {
    authListeners.forEach((listener) => listener(token));
  },
};

type AuthTokens = {
  accessToken: string;
  refreshToken?: string | null;
};

type DecodedToken = Record<string, unknown> & {
  sub?: string;
  exp?: number;
  iat?: number;
  email: string;
  phone?: string;
  user_metadata: {
    fullName: string;
    role?: string;
    profilePictureRef?: string;
  };
};

function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = jwtDecode(token) as DecodedToken | null;
    return payload ?? null;
  } catch (e) {
    console.warn("Failed to decode JWT:", e);
    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(TOKEN_KEY);
        setToken(stored);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return AuthEvents.subscribe((nextToken) => {
      setToken(nextToken);
    });
  }, []);

  const user = useMemo(() => (token ? decodeJwt(token) : null), [token]);

  const isExpired = useMemo(() => {
    const exp = user?.exp;
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  }, [user]);

  const isAuthenticated = !!token && !isExpired;

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user?.sub) {
      resetPostHogUser();
      return;
    }

    identifyPostHogUser(user.sub, {
      role: user.user_metadata?.role ?? "USER",
      hasEmail: Boolean(user.email),
    });
  }, [
    isAuthenticated,
    loading,
    user?.email,
    user?.sub,
    user?.user_metadata?.role,
  ]);

  const login = useCallback((tokens: AuthTokens) => {
    setToken(tokens.accessToken);
    AuthEvents.emit(tokens.accessToken);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    AuthEvents.emit(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const storedRefresh = await AuthStorage.getRefresh();
    if (!storedRefresh) throw new Error("No refresh token available");

    const session = await refreshSessionService(storedRefresh);
    console.log(session);

    await AuthStorage.set(session.accessToken);
    await AuthStorage.setRefresh(session.refreshToken);
    setToken(session.accessToken);
    AuthEvents.emit(session.accessToken);
  }, []);

  return {
    token,
    user,
    isAuthenticated,
    isExpired,
    loading,
    login,
    logout,
    refreshSession,
  } as const;
}

export const AuthStorage = {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  get: () => {
    if (typeof window !== "undefined") {
      return Promise.resolve(localStorage.getItem(TOKEN_KEY));
    }
    return Promise.resolve(null);
  },
  set: (value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, value);
    }
    return Promise.resolve();
  },
  getRefresh: () => {
    if (typeof window !== "undefined") {
      return Promise.resolve(localStorage.getItem(REFRESH_TOKEN_KEY));
    }
    return Promise.resolve(null);
  },
  setRefresh: (value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(REFRESH_TOKEN_KEY, value);
    }
    return Promise.resolve();
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    return Promise.resolve();
  },
};
