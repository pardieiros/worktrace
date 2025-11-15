import { useTranslation } from "react-i18next";

import type { Project } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { resolveClientLocale } from "./utils";

export interface ClientProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onSelectProject?: (project: Project) => void;
}

export function ClientProjectsTable({ projects, isLoading, onSelectProject }: ClientProjectsTableProps) {
  const { t, i18n } = useTranslation();

  const locale = resolveClientLocale(i18n.language);

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("client.projects.table.name")}</TableHead>
            <TableHead>{t("client.projects.table.hours")}</TableHead>
            <TableHead>{t("client.projects.table.lastEntry")}</TableHead>
            <TableHead>{t("client.projects.table.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4}>{t("common.loading")}</TableCell>
            </TableRow>
          )}
          {!isLoading &&
            projects.map((project) => {
              const hours = (project.total_logged_minutes / 60).toFixed(1);
              const lastEntry = project.last_logged_at
                ? new Date(project.last_logged_at).toLocaleDateString(locale)
                : t("client.projects.lastEntryNone");

              return (
                <TableRow
                  key={project.id}
                  className={onSelectProject ? "cursor-pointer hover:bg-primary/5" : undefined}
                  onClick={() => onSelectProject?.(project)}
                  onKeyDown={(event) => {
                    if (!onSelectProject) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectProject(project);
                    }
                  }}
                  role={onSelectProject ? "button" : undefined}
                  tabIndex={onSelectProject ? 0 : undefined}
                >
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{hours}h</TableCell>
                  <TableCell>{lastEntry}</TableCell>
                  <TableCell>
                    {project.status === "active"
                      ? t("client.projects.status.active")
                      : project.status === "paused"
                      ? t("client.projects.status.paused")
                      : t("client.projects.status.unknown")}
                  </TableCell>
                </TableRow>
              );
            })}
          {!isLoading && projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>{t("client.projects.empty")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}


