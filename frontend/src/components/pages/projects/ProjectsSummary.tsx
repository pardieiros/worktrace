import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

import type { ProjectSummary } from "./types";

type ProjectsSummaryProps = {
  summary: ProjectSummary;
};

export function ProjectsSummary({ summary }: ProjectsSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Card className="bg-primary-weak/20 px-4 py-3">
        <p className="text-xs uppercase text-primary/80">{t("admin.projects.stats.total")}</p>
        <p className="text-xl font-semibold text-text">{summary.total}</p>
      </Card>
      <Card className="bg-success/10 px-4 py-3">
        <p className="text-xs text-success/80 uppercase">{t("admin.projects.stats.active")}</p>
        <p className="text-xl font-semibold text-success">{summary.active}</p>
      </Card>
      <Card className="bg-warning/10 px-4 py-3">
        <p className="text-xs text-warning/80 uppercase">{t("admin.projects.stats.paused")}</p>
        <p className="text-xl font-semibold text-warning">{summary.paused}</p>
      </Card>
      <Card className="bg-danger/10 px-4 py-3">
        <p className="text-xs text-danger/80 uppercase">{t("admin.projects.stats.archived")}</p>
        <p className="text-xl font-semibold text-danger">{summary.archived}</p>
      </Card>
    </div>
  );
}

