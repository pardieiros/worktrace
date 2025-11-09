import api from "@/lib/api";
import type {
  Client,
  PaginatedResponse,
  Project,
  ProjectAssignment,
  ProjectStatus,
  ProjectVisibility,
  ReportSummary,
  TimeEntry,
  TimeEntryTimer
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

export const createProject = async (payload: CreateProjectPayload) => {
  const response = await api.post<Project>("/projects/", payload);
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

