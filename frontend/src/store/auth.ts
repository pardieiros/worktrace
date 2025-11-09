import { create } from "zustand";

import { AuthResponse, authApi, setCsrfToken, User } from "@/lib/api";

const SESSION_FLAG_KEY = "worktrace.authenticated";

const setSessionFlag = (value: boolean) => {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem(SESSION_FLAG_KEY, "1");
  } else {
    window.localStorage.removeItem(SESSION_FLAG_KEY);
  }
};

const hasSessionFlag = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_FLAG_KEY) === "1";
};

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  csrfToken: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (payload: AuthResponse | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  error: null,
  csrfToken: null,
  async initialize() {
    if (get().status !== "idle") return;

    if (!hasSessionFlag()) {
      set({ status: "unauthenticated", user: null, error: null });
      return;
    }

    set({ status: "loading", error: null });
    try {
      const data = await authApi.me();
      get().setUser(data);
    } catch (error) {
      setSessionFlag(false);
      set({ status: "unauthenticated", user: null });
    }
  },
  async login(email, password) {
    set({ status: "loading", error: null });
    try {
      const data = await authApi.login(email, password);
      get().setUser(data);
    } catch (error: any) {
      const message = error?.response?.data?.detail ?? "Falha na autenticação.";
      set({ status: "unauthenticated", error: message });
      throw error;
    }
  },
  async logout() {
    await authApi.logout();
    setSessionFlag(false);
    set({ user: null, status: "unauthenticated", csrfToken: null });
  },
  setUser(payload) {
    if (payload) {
      set({
        user: payload.user,
        status: "authenticated",
        csrfToken: payload.csrfToken ?? null,
        error: null
      });
      setSessionFlag(true);
      if (payload.csrfToken) {
        setCsrfToken(payload.csrfToken);
      }
    } else {
      set({ user: null, status: "unauthenticated", csrfToken: null });
      setCsrfToken(null);
      setSessionFlag(false);
    }
  }
}));

