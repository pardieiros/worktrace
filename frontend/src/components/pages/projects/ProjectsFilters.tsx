import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ProjectStatus, ProjectVisibility } from "@/lib/types";

import type { ProjectFilters } from "./types";

type ProjectsFiltersProps = {
  filters: ProjectFilters;
  statusOptions: Array<{ value: ProjectStatus; translationKey: string }>;
  visibilityOptions: Array<{ value: ProjectVisibility; translationKey: string }>;
  onFilterChange: (field: keyof ProjectFilters, value: string) => void;
};

const createChangeHandler =
  (
    field: keyof ProjectFilters,
    onFilterChange: ProjectsFiltersProps["onFilterChange"]
  ) =>
  (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange(field, event.target.value);
  };

export function ProjectsFilters({
  filters,
  statusOptions,
  visibilityOptions,
  onFilterChange
}: ProjectsFiltersProps) {
  const { t } = useTranslation();

  return (
    <Card className="space-y-3 p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-primary/70">
            {t("admin.projects.filters.statusLabel")}
          </label>
          <select
            className="h-10 w-full rounded-md border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.status}
            onChange={createChangeHandler("status", onFilterChange)}
          >
            <option value="all">{t("admin.projects.filters.statusAll")}</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.translationKey)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-primary/70">
            {t("admin.projects.filters.visibilityLabel")}
          </label>
          <select
            className="h-10 w-full rounded-md border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.visibility}
            onChange={createChangeHandler("visibility", onFilterChange)}
          >
            <option value="all">{t("admin.projects.filters.visibilityAll")}</option>
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.translationKey)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-primary/70">
            {t("admin.projects.filters.searchLabel")}
          </label>
          <Input
            value={filters.search}
            onChange={createChangeHandler("search", onFilterChange)}
            placeholder={t("admin.projects.filters.searchPlaceholder")}
          />
        </div>
      </div>
    </Card>
  );
}

