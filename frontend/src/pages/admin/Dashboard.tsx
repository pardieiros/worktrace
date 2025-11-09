import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProjects, fetchReportSummary } from "@/lib/queries";
import type { ReportSummary } from "@/lib/types";

export function AdminDashboardPage() {
  const { data: projectsData, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects", { limit: 5 }],
    queryFn: () => fetchProjects({ page_size: 5 })
  });
  const { data: reportData, isLoading: loadingReport } = useQuery({
    queryKey: ["reports", "summary"],
    queryFn: () => fetchReportSummary({ limit: 10 })
  });

  const totals = useMemo(() => {
    if (!reportData) return { totalHours: 0, billableHours: 0, nonBillableHours: 0 };
    const totalMinutes = reportData.reduce((acc, item) => acc + item.total_minutes, 0);
    const billable = reportData.reduce((acc, item) => acc + item.billable_minutes, 0);
    const nonBillable = reportData.reduce((acc, item) => acc + item.non_billable_minutes, 0);
    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      billableHours: (billable / 60).toFixed(1),
      nonBillableHours: (nonBillable / 60).toFixed(1)
    };
  }, [reportData]);

  const chartData = useMemo(() => {
    if (!reportData) return [];
    return reportData.map((item: ReportSummary) => ({
      name: item.project ?? "Desconhecido",
      billable: Number((item.billable_minutes / 60).toFixed(2)),
      nonBillable: Number((item.non_billable_minutes / 60).toFixed(2))
    }));
  }, [reportData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <p className="text-sm text-primary/70">Total Horas</p>
          {loadingReport ? (
            <Skeleton className="mt-4 h-8 w-28" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-text">{totals.totalHours}h</p>
          )}
        </Card>
        <Card className="flex-1">
          <p className="text-sm text-primary/70">Billable</p>
          {loadingReport ? (
            <Skeleton className="mt-4 h-8 w-28" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-success">{totals.billableHours}h</p>
          )}
        </Card>
        <Card className="flex-1">
          <p className="text-sm text-primary/70">Non-billable</p>
          {loadingReport ? (
            <Skeleton className="mt-4 h-8 w-28" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-danger">{totals.nonBillableHours}h</p>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-text">Horas por projeto</h2>
        <p className="text-sm text-primary/70">Comparação semanal de horas billable vs non-billable.</p>
        <div className="mt-6 h-80">
          {loadingReport ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="billable" stackId="a" fill="#1E88E5" />
                <Bar dataKey="nonBillable" stackId="a" fill="#90CAF9" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Projetos activos</h2>
            <p className="text-sm text-primary/70">Últimos projectos com actividade recente.</p>
          </div>
          <Badge>Actualizado</Badge>
        </div>
        <div className="mt-4 space-y-3">
          {loadingProjects && <Skeleton className="h-16 w-full" />}
          {!loadingProjects &&
            projectsData?.results.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-lg border border-primary/10 bg-white/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-text">{project.name}</p>
                  <p className="text-xs text-primary/70">{project.client_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">
                    {(project.total_logged_minutes / 60).toFixed(1)}h
                  </p>
                  <p className="text-xs text-primary/70">Actualizado {new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}


