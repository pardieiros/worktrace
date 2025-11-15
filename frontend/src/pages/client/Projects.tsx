import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Project } from "@/lib/types";
import { ClientProjectDetailDialog } from "@/components/clients/pages/projects/ClientProjectDetailDialog";
import { ClientProjectsHeader } from "@/components/clients/pages/projects/ClientProjectsHeader";
import { ClientProjectsTable } from "@/components/clients/pages/projects/ClientProjectsTable";
import { fetchProjects } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";

export function ClientProjectsPage() {
  const clientId = useAuthStore((state) =>
    state.user?.role === "CLIENT" && typeof state.user.client === "number" ? state.user.client : null
  );

  const { data, isLoading } = useQuery({
    queryKey: ["projects", "client", clientId],
    queryFn: () => fetchProjects({ client: clientId as number }),
    enabled: typeof clientId === "number"
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = data?.results ?? [];

  const handleCloseDialog = () => {
    setSelectedProject(null);
  };

  return (
    <div className="space-y-4">
      <ClientProjectsHeader />
      <ClientProjectsTable
        projects={projects}
        isLoading={isLoading}
        onSelectProject={(project) => setSelectedProject(project)}
      />
      <ClientProjectDetailDialog project={selectedProject} isOpen={selectedProject !== null} onClose={handleCloseDialog} />
    </div>
  );
}


