import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Project } from "@/lib/types";
import { useTranslation } from "react-i18next";

type ProjectDetailDialogProps = {
  project: Project | null;
  isOpen: boolean;
  locale: string;
  onClose: () => void;
};

export function ProjectDetailDialog({ project, isOpen, locale, onClose }: ProjectDetailDialogProps) {
  const { t } = useTranslation();

  if (!isOpen || project === null) {
    return null;
  }

  const updatedAt = new Date(project.updated_at).toLocaleString(locale);
  const createdAt = project.created_at
    ? new Date(project.created_at).toLocaleString(locale)
    : null;
  const totalHours = (project.total_logged_minutes ?? 0) / 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <Card className="w-full max-w-3xl space-y-6 p-6 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/10 pb-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-text">{project.name}</h2>
              <Badge variant="neutral">{project.client_name}</Badge>
              <Badge variant={project.status === "active" ? "success" : "danger"}>
                {t(`admin.projects.status.${project.status}`)}
              </Badge>
              <Badge variant="neutral">
                {t(`admin.projects.visibility.${project.visibility}`)}
              </Badge>
            </div>
            {project.description && (
              <p className="text-sm text-primary/70">{project.description}</p>
            )}
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.actions.close")}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase text-primary/70">
              {t("admin.projects.table.billing")}
            </p>
            <p className="text-lg font-semibold text-text">
              {t(`admin.projects.billing.${project.billing_type}`)}
            </p>
            <div className="mt-3 space-y-1 text-sm text-primary/80">
              {project.billing_type === "hourly" ? (
                <p>
                  {project.hourly_rate
                    ? `${project.hourly_rate} ${project.currency}/h`
                    : "No hourly rate defined"}
                </p>
              ) : (
                <>
                  <p>
                    {project.pack_hours
                      ? `${project.pack_hours}h`
                      : "Pack hours not defined"}
                  </p>
                  <p>
                    {project.pack_total_value
                      ? `${project.pack_total_value} ${project.currency}`
                      : "Pack value not defined"}
                  </p>
                </>
              )}
            </div>
          </Card>

          <Card className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase text-primary/70">
              {t("admin.projects.table.hours")}
            </p>
            <p className="text-lg font-semibold text-text">
              {totalHours.toFixed(1)}h
            </p>
            <div className="mt-3 space-y-1 text-sm text-primary/80">
              <p>Last updated: {updatedAt}</p>
              {createdAt && <p>Created at: {createdAt}</p>}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
            <h3 className="text-sm font-semibold text-text">Project details</h3>
            <dl className="space-y-2 text-sm text-primary/80">
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.projects.modal.fields.client")}
                </dt>
                <dd>{project.client_name}</dd>
              </div>
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.projects.modal.fields.status")}
                </dt>
                <dd>{t(`admin.projects.status.${project.status}`)}</dd>
              </div>
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.projects.modal.fields.visibility")}
                </dt>
                <dd>{t(`admin.projects.visibility.${project.visibility}`)}</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-2 rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
            <h3 className="text-sm font-semibold text-text">Billing details</h3>
            <dl className="space-y-2 text-sm text-primary/80">
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.projects.modal.fields.currency")}
                </dt>
                <dd>{project.currency}</dd>
              </div>
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.projects.modal.fields.packHours")}
                </dt>
                <dd>{project.pack_hours ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.projects.modal.fields.packValue")}
                </dt>
                <dd>
                  {project.pack_total_value
                    ? `${project.pack_total_value} ${project.currency}`
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>
    </div>
  );
}

