import api from "@/lib/api";
import type {
  Client,
  ClientAccountEntry,
  ClientAccountSummary,
  PaginatedResponse,
  Project,
  ProjectAssignment,
  ProjectStatus,
  ProjectVisibility,
  ReportSummary,
  SystemSettings,
  TimeEntry,
  TimeEntryTimer,
  User
} from "@/lib/types";

export interface CreateClientPayload {
  name: string;
  email: string;
  vat?: string;
  notes?: string;
  branding_logo?: File | null;
}

export interface CreateClientResponse extends Client {
  initial_password?: string;
}

export interface CreateProjectPayload {
  name: string;
  client: number;
  description?: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  billing_type: "hourly" | "pack";
  currency: string;
  hourly_rate: string | number;
  pack_hours?: string | number;
  pack_total_value?: string | number;
}

export const fetchClients = async () => {
  const response = await api.get<PaginatedResponse<Client>>("/clients/");
  return response.data;
};

export const fetchClient = async (id: number) => {
  const response = await api.get<Client>(`/clients/${id}/`);
  return response.data;
};

export const fetchClientAccount = async (id: number) => {
  const response = await api.get<ClientAccountSummary>(`/clients/${id}/account/`);
  return response.data;
};

export const fetchUsers = async (params?: Record<string, string | number | undefined>) => {
  const response = await api.get<PaginatedResponse<User>>("/users/", { params });
  return response.data;
};

export const createClient = async (payload: CreateClientPayload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  if (payload.vat) {
    formData.append("vat", payload.vat);
  }
  if (payload.notes) {
    formData.append("notes", payload.notes);
  }
  if (payload.branding_logo) {
    formData.append("branding_logo", payload.branding_logo);
  }
  const response = await api.post<CreateClientResponse>("/clients/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const fetchProjects = async (params?: Record<string, string | number | undefined>) => {
  const response = await api.get<PaginatedResponse<Project>>("/projects/", { params });
  return response.data;
};

export const fetchSystemSettings = async () => {
  const response = await api.get<SystemSettings>("/settings/system/");
  return response.data;
};

export const createProject = async (payload: CreateProjectPayload) => {
  const response = await api.post<Project>("/projects/", payload);
  return response.data;
};

export interface UpdateProjectPayload {
  name?: string;
  client?: number;
  description?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  billing_type?: "hourly" | "pack";
  currency?: string;
  hourly_rate?: string | number;
  pack_hours?: string | number;
  pack_total_value?: string | number;
}

export const updateProject = async (id: number, payload: UpdateProjectPayload) => {
  const response = await api.patch<Project>(`/projects/${id}/`, payload);
  return response.data;
};

export const updateProjectStatus = async (id: number, status: ProjectStatus) => {
  const response = await api.post<Project>(`/projects/${id}/status/`, { status });
  return response.data;
};

export const fetchTimeEntries = async (params?: Record<string, string | number | undefined>) => {
  const response = await api.get<PaginatedResponse<TimeEntry>>("/time-entries/", { params });
  return response.data;
};

export const fetchReportSummary = async (params?: Record<string, string | number | undefined>) => {
  const response = await api.get<ReportSummary[]>("/reports/summary", { params });
  return response.data;
};

export const fetchAssignments = async () => {
  const response = await api.get<PaginatedResponse<ProjectAssignment>>("/assignments/");
  return response.data;
};

export interface CreateAssignmentPayload {
  project: number;
  user: number;
  role: "member" | "manager";
  is_active?: boolean;
}

export const createAssignment = async (payload: CreateAssignmentPayload) => {
  const response = await api.post<ProjectAssignment>("/assignments/", payload);
  return response.data;
};

export interface CreateClientPaymentPayload {
  amount: string | number;
  currency?: string;
  occurred_at?: string;
  reference?: string;
  description?: string;
  payment_method?: string;
  notes?: string;
}

export const createClientPayment = async (clientId: number, payload: CreateClientPaymentPayload) => {
  const response = await api.post<ClientAccountEntry>(`/clients/${clientId}/payments/`, payload);
  return response.data;
};

export interface UpdateSystemSettingsPayload {
  company_name: string;
  company_legal_name: string;
  company_email: string;
  company_phone: string;
  company_website: string;
  company_vat: string;
  company_address: string;
  support_email: string;
  billing_email: string;
  default_sender_name: string;
  default_sender_email: string;
  reply_to_email: string;
  branding_logo?: File | null;
  remove_branding_logo?: boolean;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_use_tls: boolean;
  smtp_use_ssl: boolean;
  smtp_password?: string;
}

export const updateSystemSettings = async (payload: UpdateSystemSettingsPayload) => {
  const formData = new FormData();
  formData.append("company_name", payload.company_name);
  formData.append("company_legal_name", payload.company_legal_name);
  formData.append("company_email", payload.company_email);
  formData.append("company_phone", payload.company_phone);
  formData.append("company_website", payload.company_website);
  formData.append("company_vat", payload.company_vat);
  formData.append("company_address", payload.company_address);
  formData.append("support_email", payload.support_email);
  formData.append("billing_email", payload.billing_email);
  formData.append("default_sender_name", payload.default_sender_name);
  formData.append("default_sender_email", payload.default_sender_email);
  formData.append("reply_to_email", payload.reply_to_email);
  formData.append("smtp_host", payload.smtp_host);
  formData.append("smtp_port", String(payload.smtp_port));
  formData.append("smtp_username", payload.smtp_username);
  formData.append("smtp_use_tls", String(payload.smtp_use_tls));
  formData.append("smtp_use_ssl", String(payload.smtp_use_ssl));

  if (typeof payload.remove_branding_logo === "boolean") {
    formData.append("remove_branding_logo", String(payload.remove_branding_logo));
  }

  if (payload.branding_logo instanceof File) {
    formData.append("branding_logo", payload.branding_logo);
  }

  if (typeof payload.smtp_password === "string") {
    formData.append("smtp_password", payload.smtp_password);
  }

  const response = await api.put<SystemSettings>("/settings/system/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export interface CreateTimerPayload {
  project: number;
  notes?: string;
}

export const fetchTimers = async (params?: Record<string, string | number | undefined>) => {
  const response = await api.get<PaginatedResponse<TimeEntryTimer>>("/time-entry-timers/", {
    params
  });
  return response.data;
};

export const createTimer = async (payload: CreateTimerPayload) => {
  const response = await api.post<TimeEntryTimer>("/time-entry-timers/", payload);
  return response.data;
};

export const pauseTimer = async (id: number) => {
  const response = await api.post<TimeEntryTimer>(`/time-entry-timers/${id}/pause/`);
  return response.data;
};

export const resumeTimer = async (id: number) => {
  const response = await api.post<TimeEntryTimer>(`/time-entry-timers/${id}/resume/`);
  return response.data;
};

export interface StopTimerPayload {
  summary: string;
  task?: string;
  billable?: boolean;
}

export const stopTimer = async (id: number, payload: StopTimerPayload) => {
  const response = await api.post<TimeEntry>(`/time-entry-timers/${id}/stop/`, payload);
  return response.data;
};

