export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Client {
  id: number;
  name: string;
  email: string;
  vat: string;
  notes: string;
  is_active: boolean;
  branding_logo: string | null;
  branding_logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = "active" | "paused" | "archived";
export type ProjectVisibility = "internal" | "client";

export interface Project {
  id: number;
  name: string;
  client: number;
  client_name: string;
  description: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  total_logged_minutes: number;
  total_logged_hours: number;
  last_logged_at: string | null;
}

export interface TimeEntry {
  id: number;
  project: number;
  project_name: string;
  user: number;
  user_email: string;
  date: string;
  start: string | null;
  end: string | null;
  duration_minutes: number;
  task: string;
  notes: string;
  billable: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportSummary {
  client: string | null;
  project: string | null;
  user: string | null;
  total_minutes: number;
  billable_minutes: number;
  non_billable_minutes: number;
  total_amount: string | number | null;
}

export interface ProjectAssignment {
  id: number;
  project: number;
  project_name: string;
  user: number;
  user_email: string;
  user_name: string;
  role: "member" | "manager";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

