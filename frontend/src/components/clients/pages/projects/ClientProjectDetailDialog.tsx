import { Fragment, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchTimeEntries } from "@/lib/queries";
import type { PaginatedResponse, Project, TimeEntry } from "@/lib/types";
import { resolveClientLocale } from "./utils";

export interface ClientProjectDetailDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientProjectDetailDialog({ project, isOpen, onClose }: ClientProjectDetailDialogProps) {
  const { t, i18n } = useTranslation();
  const locale = useMemo(() => resolveClientLocale(i18n.language), [i18n.language]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    if (project) {
      setPage(1);
    }
  }, [project?.id]);

  const { data, isLoading } = useQuery<PaginatedResponse<TimeEntry>>({
    enabled: isOpen && !!project,
    queryKey: ["client", "projects", project?.id, "time-entries", page],
    queryFn: () =>
      fetchTimeEntries({
        project: project?.id,
        ordering: "-date",
        page,
        page_size: PAGE_SIZE
      })
  });

  if (!isOpen || project === null) {
    return null;
  }

  const timeEntries: TimeEntry[] = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const billingContent =
    project.billing_type === "pack"
      ? [
          {
            label: t("client.projects.modal.packHours", "Pack hours"),
            value: project.pack_hours ?? t("client.projects.modal.notAvailable", "Not available")
          },
          {
            label: t("client.projects.modal.packValue", "Pack value"),
            value: project.pack_total_value
              ? `${project.pack_total_value} ${project.currency}`
              : t("client.projects.modal.notAvailable", "Not available")
          }
        ]
      : [
          {
            label: t("client.projects.modal.hourlyRate", "Hourly rate"),
            value: project.hourly_rate
              ? `${project.hourly_rate} ${project.currency}/h`
              : t("client.projects.modal.notAvailable", "Not available")
          }
        ];

  const statusVariant =
    project.status === "active" ? "success" : project.status === "paused" ? "neutral" : "danger";

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
      onClick={onClose}
      data-testid="client-project-detail-dialog"
    >
      <Card
        className="w-full max-w-4xl space-y-6 p-6 shadow-xl"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/10 pb-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-text">{project.name}</h2>
              <Badge variant="neutral">{project.client_name}</Badge>
              <Badge variant={statusVariant}>
                {t(`client.projects.status.${project.status}`, project.status)}
              </Badge>
              <Badge variant="neutral">
                {t(`admin.projects.billing.${project.billing_type}`, project.billing_type)}
              </Badge>
            </div>
            {project.description && <p className="text-sm text-primary/70">{project.description}</p>}
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.actions.close", "Close")}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase text-primary/70">
              {t("client.projects.modal.billingTitle", "Billing")}
            </p>
            <p className="text-lg font-semibold text-text">
              {t(`admin.projects.billing.${project.billing_type}`, project.billing_type)}
            </p>
            <dl className="mt-3 space-y-1 text-sm text-primary/80">
              {billingContent.map((item) => (
                <Fragment key={item.label}>
                  <dt className="font-medium text-primary/90">{item.label}</dt>
                  <dd>{item.value}</dd>
                </Fragment>
              ))}
            </dl>
          </Card>

          <Card className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase text-primary/70">
              {t("client.projects.modal.activityTitle", "Activity")}
            </p>
            <p className="text-lg font-semibold text-text">
              {((project.total_logged_minutes ?? 0) / 60).toFixed(1)}h
            </p>
            <div className="mt-3 space-y-1 text-sm text-primary/80">
              <p>
                {t("client.projects.modal.lastEntryAt", "Last entry")}:{" "}
                {project.last_logged_at
                  ? new Date(project.last_logged_at).toLocaleString(locale)
                  : t("client.projects.lastEntryNone")}
              </p>
              <p>
                {t("client.projects.modal.updatedAt", "Updated at")}:{" "}
                {new Date(project.updated_at).toLocaleString(locale)}
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text">
              {t("client.projects.modal.timeEntriesTitle", "Recent time entries")}
            </h3>
            <div className="flex items-center gap-3 text-sm text-primary/70">
              {isLoading ? t("common.loading", "Loading...") : null}
              {totalCount > 0 ? (
                <span>
                  {t("client.projects.modal.timeEntries.pagination", "Página {{current}} de {{total}}", {
                    current: page,
                    total: totalPages
                  })}
                </span>
              ) : null}
            </div>
          </div>
          <Card className="border border-primary/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("client.projects.modal.timeEntries.date", "Date")}</TableHead>
                  <TableHead>{t("client.projects.modal.timeEntries.duration", "Duration")}</TableHead>
                  <TableHead>{t("client.projects.modal.timeEntries.billable", "Billable")}</TableHead>
                  <TableHead>{t("client.projects.modal.timeEntries.notes", "Notes")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-primary/70">
                      {t("client.projects.modal.timeEntries.empty", "No time entries available.")}
                    </TableCell>
                  </TableRow>
                )}
                {timeEntries.map((entry) => {
                  const duration = (entry.duration_minutes / 60).toFixed(2);
                  const amount =
                    entry.billable && entry.amount
                      ? `${entry.amount}${entry.currency ? ` ${entry.currency}` : ""}`
                      : null;

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString(locale)}</TableCell>
                      <TableCell>
                        {duration}h
                        {amount ? <span className="ml-2 text-xs text-primary/60">({amount})</span> : null}
                      </TableCell>
                      <TableCell>{entry.billable ? t("common.yes", "Yes") : t("common.no", "No")}</TableCell>
                      <TableCell className="max-w-xs truncate">{entry.notes || "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
          <div className="flex items-center justify-between text-sm text-primary/80">
            <span>
              {totalCount > 0
                ? t("client.projects.modal.timeEntries.total", "{{count}} registos", {
                    count: totalCount
                  })
                : t("client.projects.modal.timeEntries.noData", "Sem registos para este projeto.")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded border border-primary/20 px-3 py-1 text-sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                {t("common.actions.previous", "Anterior")}
              </button>
              <button
                type="button"
                className="rounded border border-primary/20 px-3 py-1 text-sm"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                {t("common.actions.next", "Seguinte")}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


