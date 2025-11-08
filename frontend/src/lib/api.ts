import axios, { AxiosError } from "axios";

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

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await api.post("/auth/refresh");
        if (error.config) {
          return api.request(error.config);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
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

