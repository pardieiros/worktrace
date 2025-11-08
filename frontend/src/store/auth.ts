import { create } from "zustand";

import { AuthResponse, authApi, setCsrfToken, User } from "@/lib/api";

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
    set({ status: "loading", error: null });
    try {
      const data = await authApi.me();
      get().setUser(data);
    } catch (error) {
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
      if (payload.csrfToken) {
        setCsrfToken(payload.csrfToken);
      }
    } else {
      set({ user: null, status: "unauthenticated", csrfToken: null });
      setCsrfToken(null);
    }
  }
}));

