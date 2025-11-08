import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import api from "@/lib/api";
import { fetchProjects, fetchTimeEntries } from "@/lib/queries";
import type { Project, TimeEntry } from "@/lib/types";

export function AdminTimeEntriesPage() {
  const [filters, setFilters] = useState({
    project: "",
    from: "",
    to: ""
  });

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ["time-entries", filters],
    queryFn: () =>
      fetchTimeEntries({
        project: filters.project || undefined,
        from_date: filters.from || undefined,
        to_date: filters.to || undefined
      })
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects({ page_size: 100 })
  });

  const projects = useMemo(() => projectsData?.results ?? [], [projectsData]);

  const handleExport = async (format: "csv" | "pdf") => {
    const endpoint = format === "csv" ? "/reports/export.csv" : "/reports/export.pdf";
    const response = await api.get(endpoint, {
      params: {
        project: filters.project || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined
      },
      responseType: "blob"
    });
    const blob = new Blob([response.data], {
      type: format === "csv" ? "text/csv" : "application/pdf"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `worktrace-report.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const entries = entriesData?.results ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">Registo de horas</h1>
          <p className="text-sm text-primary/70">
            Monitorize entradas de tempo com filtros rápidos e exportação segura.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            Exportar CSV
          </Button>
          <Button onClick={() => handleExport("pdf")}>Exportar PDF</Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-text" htmlFor="project-select">
              Projeto
            </label>
            <select
              id="project-select"
              className="mt-1 w-full rounded-md border border-primary/25 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.project}
              onChange={(event) => setFilters((prev) => ({ ...prev, project: event.target.value }))}
            >
              <option value="">Todos</option>
              {projects.map((project: Project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-text" htmlFor="from">
              Desde
            </label>
            <Input
              id="from"
              type="date"
              value={filters.from}
              onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text" htmlFor="to">
              Até
            </label>
            <Input
              id="to"
              type="date"
              value={filters.to}
              onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
            />
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Utilizador</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Billable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>A carregar...</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              entries.map((entry: TimeEntry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.project_name}</TableCell>
                  <TableCell>{entry.user_email}</TableCell>
                  <TableCell>{entry.task}</TableCell>
                  <TableCell>{(entry.duration_minutes / 60).toFixed(2)}h</TableCell>
                  <TableCell>{entry.billable ? "Sim" : "Não"}</TableCell>
                </TableRow>
              ))}
            {!isLoading && entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>Sem registos neste período.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

