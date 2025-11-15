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

export type ClientAccountEntryType = "charge" | "payment";

export interface ClientAccountEntry {
  id: number;
  entry_type: ClientAccountEntryType;
  amount: string;
  currency: string;
  occurred_at: string;
  reference: string | null;
  description: string;
  payment_method: string;
  notes: string;
  recorded_by: number | null;
  recorded_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientPackProjectSummary {
  id: number;
  name: string;
  pack_hours: string | null;
  pack_total_value: string;
  currency: string;
  status: ProjectStatus;
}

export interface ClientHourlyProjectSummary {
  id: number;
  name: string;
  billable_minutes: number;
  billable_hours: string;
  amount: string;
  currency: string;
}

export interface ClientAccountSummary {
  client: Client;
  balance: string;
  total_charged: string;
  total_paid: string;
  currency: string;
  entries: ClientAccountEntry[];
  pack_total_due: string;
  pack_projects: ClientPackProjectSummary[];
  hourly_total_due: string;
  hourly_projects: ClientHourlyProjectSummary[];
}

export type UserRole = "ADMIN" | "CLIENT";

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  client: number | null;
}

export interface SystemSettings {
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
  branding_logo: string | null;
  branding_logo_url: string | null;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_use_tls: boolean;
  smtp_use_ssl: boolean;
  smtp_password_set: boolean;
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
  billing_type: "hourly" | "pack";
  pack_hours: string | null;
  pack_total_value: string | null;
  hourly_rate: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
  total_logged_minutes: number;
  total_logged_hours: number;
  last_logged_at: string | null;
}

export interface TimeEntryTimer {
  id: number;
  project: number;
  project_name: string;
  user: number;
  user_email: string;
  status: "running" | "paused";
  started_at: string;
  last_resumed_at: string | null;
  accumulated_seconds: number;
  elapsed_seconds: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: number;
  project: number;
  project_name: string;
  client_name?: string | null;
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
  hourly_rate?: string | null;
  amount?: string | null;
  currency?: string | null;
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

