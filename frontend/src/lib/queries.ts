import api from "@/lib/api";
import type {
  Client,
  PaginatedResponse,
  Project,
  ProjectAssignment,
  ReportSummary,
  TimeEntry
} from "@/lib/types";

export const fetchClients = async () => {
  const response = await api.get<PaginatedResponse<Client>>("/clients/");
  return response.data;
};

export const fetchProjects = async (params?: Record<string, string | number | undefined>) => {
  const response = await api.get<PaginatedResponse<Project>>("/projects/", { params });
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

