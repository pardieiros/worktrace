import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchProjects } from "@/lib/queries";
import type { Project } from "@/lib/types";

const statusLabels: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  archived: "Arquivado"
};

export function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["projects", { search }],
    queryFn: () => fetchProjects(),
    keepPreviousData: true
  });

  const projects = data?.results ?? [];
  const filtered = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Projetos</h1>
          <p className="text-sm text-primary/70">
            Controle visibilidade, estado e horas registadas por projeto.
          </p>
        </div>
        <Button>Criar projeto</Button>
      </div>
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <Input
            placeholder="Filtrar por nome..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          <span className="text-sm text-primary/70">
            {filtered.length} projetos listados
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Visibilidade</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Atualizado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>A carregar...</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              filtered.map((project: Project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.client_name}</TableCell>
                  <TableCell>
                    <Badge variant={project.status === "active" ? "success" : "neutral"}>
                      {statusLabels[project.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.visibility === "client" ? "Cliente" : "Interno"}</TableCell>
                  <TableCell>{(project.total_logged_minutes / 60).toFixed(1)}h</TableCell>
                  <TableCell>{new Date(project.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>Sem projetos para apresentar.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

