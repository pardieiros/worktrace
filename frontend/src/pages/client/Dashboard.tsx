import { useQuery } from "@tanstack/react-query";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProjects, fetchReportSummary } from "@/lib/queries";

export function ClientDashboardPage() {
  const { data: projectsData, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects", "client"],
    queryFn: () => fetchProjects()
  });
  const { data: reportData, isLoading: loadingReport } = useQuery({
    queryKey: ["reports", "client"],
    queryFn: () => fetchReportSummary()
  });

  const totalProjects = projectsData?.results.length ?? 0;
  const totalHours = (reportData ?? []).reduce(
    (acc, row) => acc + row.total_minutes / 60,
    0
  );

  const chartData = (reportData ?? []).map((row) => ({
    name: row.project ?? "Projeto",
    value: Number((row.total_minutes / 60).toFixed(2))
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm text-primary/70">Projetos atribuídos</p>
          {loadingProjects ? (
            <Skeleton className="mt-4 h-10 w-24" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-text">{totalProjects}</p>
          )}
        </Card>
        <Card>
          <p className="text-sm text-primary/70">Horas totais</p>
          {loadingReport ? (
            <Skeleton className="mt-4 h-10 w-32" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-primary">{totalHours.toFixed(1)}h</p>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-text">Distribuição por projeto</h2>
        <div className="mt-6 h-80">
          {loadingReport ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#1E88E5"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}

