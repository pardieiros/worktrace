import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { ProjectCreateModal } from "@/components/pages/projects/ProjectCreateModal";
import { ProjectDetailDialog } from "@/components/pages/projects/ProjectDetailDialog";
import { ProjectsFilters } from "@/components/pages/projects/ProjectsFilters";
import { ProjectsSummary } from "@/components/pages/projects/ProjectsSummary";
import { ProjectsTable } from "@/components/pages/projects/ProjectsTable";
import type { ProjectFilters, ProjectSummary } from "@/components/pages/projects/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchProjects, updateProjectStatus } from "@/lib/queries";
import type { Project, ProjectStatus, ProjectVisibility } from "@/lib/types";

const statusOptions: Array<{ value: ProjectStatus; translationKey: string }> = [
  { value: "active", translationKey: "admin.projects.status.active" },
  { value: "paused", translationKey: "admin.projects.status.paused" },
  { value: "archived", translationKey: "admin.projects.status.archived" }
];

const visibilityOptions: Array<{ value: ProjectVisibility; translationKey: string }> = [
  { value: "client", translationKey: "admin.projects.visibility.client" },
  { value: "internal", translationKey: "admin.projects.visibility.internal" }
];

const defaultFilters: ProjectFilters = {
  status: "all",
  visibility: "all",
  search: ""
};

export function AdminProjectsPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pendingProjectId, setPendingProjectId] = useState<number | null>(null);

  const locale = useMemo(() => {
    const language = i18n.language.split("-")[0];
    switch (language) {
      case "pt":
        return "pt-PT";
      case "es":
        return "es-ES";
      case "fr":
        return "fr-FR";
      default:
        return "en-US";
    }
  }, [i18n.language]);

  const {
    data: projectsResponse,
    isLoading: isLoadingProjects,
    isError: isProjectsError
  } = useQuery({
    queryKey: ["projects", "admin", filters],
    queryFn: () =>
      fetchProjects({
        status: filters.status !== "all" ? filters.status : undefined,
        visibility: filters.visibility !== "all" ? filters.visibility : undefined,
        search: filters.search || undefined,
        page_size: 100
      })
  });

  const projects = projectsResponse?.results ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ projectId, status }: { projectId: number; status: ProjectStatus }) =>
      updateProjectStatus(projectId, status),
    onMutate: ({ projectId }) => {
      setPendingProjectId(projectId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects", "admin"] });
    },
    onError: (error) => {
      console.error("Failed to update project status", error);
    },
    onSettled: () => {
      setPendingProjectId(null);
    }
  });

  const summary = useMemo<ProjectSummary>(() => {
    if (!projects.length) {
      return {
        total: 0,
        active: 0,
        paused: 0,
        archived: 0
      };
    }
    return projects.reduce(
      (accumulator, project) => {
        accumulator.total += 1;
        if (project.status === "active") accumulator.active += 1;
        if (project.status === "paused") accumulator.paused += 1;
        if (project.status === "archived") accumulator.archived += 1;
        return accumulator;
      },
      { total: 0, active: 0, paused: 0, archived: 0 } as ProjectSummary
    );
  }, [projects]);

  const handleFilterChange = (field: keyof ProjectFilters, value: string) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProject(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">{t("admin.projects.title")}</h1>
          <p className="text-sm text-primary/70">{t("admin.projects.subtitle")}</p>
        </div>
        <Button type="button" onClick={handleOpenCreateModal}>
          {t("admin.projects.actions.newProject")}
        </Button>
      </div>

      <ProjectsFilters
        filters={filters}
        statusOptions={statusOptions}
        visibilityOptions={visibilityOptions}
        onFilterChange={handleFilterChange}
      />

      <ProjectsSummary summary={summary} />

      <Card>
        <ProjectsTable
          projects={projects}
          isLoading={isLoadingProjects}
          locale={locale}
          errorMessage={isProjectsError ? t("admin.projects.errors.fetchFallback") : null}
          onSelectProject={handleSelectProject}
          onQuickAction={(project, status) => {
            updateStatusMutation.mutate({ projectId: project.id, status });
          }}
          pendingProjectId={pendingProjectId}
        />
      </Card>

      <ProjectDetailDialog
        project={selectedProject}
        isOpen={selectedProject !== null}
        locale={locale}
        onClose={handleCloseProjectDetail}
      />

      <ProjectCreateModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
    </div>
  );
}

