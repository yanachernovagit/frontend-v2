import { useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";

type DecodedToken = Record<string, any> & {
  sub?: string;
  exp?: number;
  iat?: number;
  email: string;
  phone: string;
  user_metadata: {
    fullName: string;
  };
};

function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = jwtDecode(token) as DecodedToken | null;
    return payload ?? null;
  } catch (e) {
    console.warn("Failed to decode JWT with jsonwebtoken:", e);
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

  const user = useMemo(() => (token ? decodeJwt(token) : null), [token]);

  const isExpired = useMemo(() => {
    const exp = user?.exp;
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  }, [user]);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, newToken);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  return {
    token,
    user,
    isAuthenticated: !!token && !isExpired,
    isExpired,
    loading,
    login,
    logout,
  } as const;
}

export const AuthStorage = {
  TOKEN_KEY,
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
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.resolve();
  },
};
