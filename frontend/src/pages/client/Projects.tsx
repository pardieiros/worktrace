import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchProjects } from "@/lib/queries";

export function ClientProjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", "client"],
    queryFn: () => fetchProjects()
  });

  const projects = data?.results ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-text">Projetos</h1>
        <p className="text-sm text-primary/70">
          Lista dos projetos com visibilidade cliente e o progresso de horas.
        </p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Último registo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>A carregar...</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{(project.total_logged_minutes / 60).toFixed(1)}h</TableCell>
                  <TableCell>
                    {project.last_logged_at
                      ? new Date(project.last_logged_at).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>{project.status === "active" ? "Ativo" : "Pausado"}</TableCell>
                </TableRow>
              ))}
            {!isLoading && projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>Sem projetos disponíveis.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}


