import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const SESSION_FLAG_KEY = "worktrace.authenticated";

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
  client: number | null;
}

export interface AuthResponse {
  user: User;
  csrfToken?: string;
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  }
});

let csrfToken: string | null = null;

export const setCsrfToken = (token: string | null) => {
  csrfToken = token;
  if (token) {
    api.defaults.headers.common["X-CSRFToken"] = token;
  } else {
    delete api.defaults.headers.common["X-CSRFToken"];
  }
};

type AxiosRequestConfigWithRetry = AxiosRequestConfig & { _retry?: boolean };

const redirectToLogin = () => {
  setCsrfToken(null);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_FLAG_KEY);
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { response, config } = error;
    const originalRequest = config as AxiosRequestConfigWithRetry | undefined;

    if (response?.status === 401) {
      const requestUrl = originalRequest?.url ?? "";

      // If refresh token request failed or we are not on a protected page, redirect to login
      if (requestUrl.includes("/auth/refresh")) {
        redirectToLogin();
        return Promise.reject(error);
      }

      // Avoid trying to refresh for login attempts
      if (requestUrl.includes("/auth/login")) {
        return Promise.reject(error);
      }

      if (!originalRequest?._retry) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await api.post<AuthResponse>("/auth/refresh");
          if (refreshResponse.data?.csrfToken) {
            setCsrfToken(refreshResponse.data.csrfToken);
          }
          return api.request(originalRequest);
        } catch (refreshError) {
          redirectToLogin();
          return Promise.reject(refreshError);
        }
      }

      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    if (response.data.csrfToken) {
      setCsrfToken(response.data.csrfToken);
    }
    return response.data;
  },
  async logout() {
    await api.post("/auth/logout");
    setCsrfToken(null);
  },
  async me() {
    const response = await api.get<AuthResponse>("/auth/me");
    if (response.data.csrfToken) {
      setCsrfToken(response.data.csrfToken);
    }
    return response.data;
  }
};

export default api;

