import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthState = {
  authenticated: boolean;
  admin: boolean;
  username: string | null;
  loading: boolean;
};

type AuthContextValue = {
  auth: AuthState;
  refreshAuth: () => Promise<void>;
  setSignedOut: () => void;
  setSignedIn: (username: string | null) => void;
};

const signedOutState: AuthState = {
  authenticated: false,
  admin: false,
  username: null,
  loading: false,
};

const initialState: AuthState = {
  ...signedOutState,
  loading: true,
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchAuthState(): Promise<Omit<AuthState, "loading">> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Auth request failed: ${response.status}`);
  }

  const payload = (await response.json()) as Partial<AuthState>;
  return {
    authenticated: Boolean(payload.authenticated),
    admin: Boolean(payload.admin),
    username: payload.username ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialState);

  const refreshAuth = useCallback(async () => {
    try {
      const nextState = await fetchAuthState();
      setAuth({ ...nextState, loading: false });
    } catch {
      setAuth(signedOutState);
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    const handleFocus = () => {
      void refreshAuth();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [refreshAuth]);

  const value = useMemo<AuthContextValue>(() => ({
    auth,
    refreshAuth,
    setSignedOut: () => setAuth(signedOutState),
    setSignedIn: (username) => {
      setAuth({
        authenticated: true,
        admin: true,
        username,
        loading: false,
      });
    },
  }), [auth, refreshAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
