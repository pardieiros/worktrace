import type { ProjectStatus, ProjectVisibility } from "@/lib/types";

export type ProjectFilters = {
  status: "all" | ProjectStatus;
  visibility: "all" | ProjectVisibility;
  search: string;
};

export type ProjectSummary = {
  total: number;
  active: number;
  paused: number;
  archived: number;
};

