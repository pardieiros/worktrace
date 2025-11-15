import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Project, ProjectStatus } from "@/lib/types";

type ProjectsTableProps = {
  projects: Project[];
  isLoading: boolean;
  locale: string;
  errorMessage?: string | null;
  onSelectProject: (project: Project) => void;
  onQuickAction?: (project: Project, status: ProjectStatus) => void;
  pendingProjectId?: number | null;
};

export function ProjectsTable({
  projects,
  isLoading,
  locale,
  errorMessage,
  onSelectProject,
  onQuickAction,
  pendingProjectId
}: ProjectsTableProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.projects.table.name")}</TableHead>
            <TableHead>{t("admin.projects.table.client")}</TableHead>
            <TableHead>{t("admin.projects.table.status")}</TableHead>
            <TableHead>{t("admin.projects.table.visibility")}</TableHead>
            <TableHead>{t("admin.projects.table.billing")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("admin.projects.table.hours")}
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              {t("admin.projects.table.updated")}
            </TableHead>
            <TableHead>{t("admin.projects.table.actions", { defaultValue: "Ações" })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={8}>{t("common.loading")}</TableCell>
            </TableRow>
          )}
          {!isLoading && projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={8}>{t("admin.projects.empty")}</TableCell>
            </TableRow>
          )}
          {!isLoading &&
            projects.map((project) => (
              <TableRow
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectProject(project)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectProject(project);
                  }
                }}
                className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <TableCell>
                  <div>
                    <p className="font-semibold text-text">{project.name}</p>
                    {project.description && (
                      <p className="text-xs text-primary/70">{project.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{project.client_name}</TableCell>
                <TableCell>{t(`admin.projects.status.${project.status}`)}</TableCell>
                <TableCell>{t(`admin.projects.visibility.${project.visibility}`)}</TableCell>
                <TableCell>
                  <p>{t(`admin.projects.billing.${project.billing_type}`)}</p>
                  <p className="text-xs text-primary/70">
                    {project.billing_type === "hourly" && project.hourly_rate
                      ? `${project.hourly_rate} ${project.currency}/h`
                      : project.billing_type === "pack" &&
                          project.pack_hours &&
                          project.pack_total_value
                        ? `${project.pack_hours}h • ${project.pack_total_value} ${project.currency}`
                        : "—"}
                  </p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {(project.total_logged_minutes / 60).toFixed(1)}h
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {new Date(project.updated_at).toLocaleDateString(locale)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {(["active", "paused", "archived"] as ProjectStatus[]).map((status) => {
                      const isDisabled =
                        project.status === status || !onQuickAction || pendingProjectId === project.id;
                      return (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (onQuickAction) {
                              onQuickAction(project, status);
                            }
                          }}
                          disabled={isDisabled}
                        >
                          {t(`admin.projects.actions.${status}`, {
                            defaultValue:
                              status === "active"
                                ? "Ativar"
                                : status === "paused"
                                  ? "Pausar"
                                  : "Arquivar"
                          })}
                        </Button>
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
    </div>
  );
}

