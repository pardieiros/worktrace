import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { fetchReportSummary } from "@/lib/queries";

export function AdminReportsPage() {
  const [billableFilter, setBillableFilter] = useState<"all" | "billable" | "non-billable">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["reports", billableFilter],
    queryFn: () =>
      fetchReportSummary({
        billable:
          billableFilter === "all" ? undefined : billableFilter === "billable" ? "true" : "false"
      })
  });

  const rows = data ?? [];

  const totals = useMemo(() => {
    if (!rows.length) {
      return { amount: 0, minutes: 0 };
    }
    const amount = rows.reduce((acc, row) => acc + Number(row.total_amount ?? 0), 0);
    const minutes = rows.reduce((acc, row) => acc + row.total_minutes, 0);
    return { amount, minutes };
  }, [rows]);

  const chartData = rows.map((row) => ({
    name: row.project ?? "Desconhecido",
    horas: Number((row.total_minutes / 60).toFixed(2))
  }));

  const handleExport = async (format: "csv" | "pdf") => {
    const endpoint = format === "csv" ? "/reports/export.csv" : "/reports/export.pdf";
    const response = await api.get(endpoint, {
      params: {
        billable:
          billableFilter === "all" ? undefined : billableFilter === "billable" ? "true" : "false"
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">Relatórios</h1>
          <p className="text-sm text-primary/70">
            Resumos por projeto e utilizador com exportação segura.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            CSV
          </Button>
          <Button onClick={() => handleExport("pdf")}>PDF</Button>
        </div>
      </div>

      <Card className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-text">Filtro:</span>
        <Button
          variant={billableFilter === "all" ? "default" : "subtle"}
          onClick={() => setBillableFilter("all")}
        >
          Todos
        </Button>
        <Button
          variant={billableFilter === "billable" ? "default" : "subtle"}
          onClick={() => setBillableFilter("billable")}
        >
          Billable
        </Button>
        <Button
          variant={billableFilter === "non-billable" ? "default" : "subtle"}
          onClick={() => setBillableFilter("non-billable")}
        >
          Non-billable
        </Button>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-primary/70">Horas totais</p>
          {isLoading ? (
            <p className="mt-2 text-2xl font-semibold text-text">—</p>
          ) : (
            <p className="mt-2 text-2xl font-semibold text-text">
              {(totals.minutes / 60).toFixed(1)}h
            </p>
          )}
        </Card>
        <Card>
          <p className="text-sm text-primary/70">Projetos</p>
          <p className="mt-2 text-2xl font-semibold text-text">{rows.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-primary/70">Valor faturado</p>
          <p className="mt-2 text-2xl font-semibold text-success">
            {totals.amount.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
          </p>
        </Card>
      </div>

      <Card>
        <div className="h-72">
          {isLoading ? (
            <p>A carregar gráfico...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="horas" stroke="#1E88E5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Billable</TableHead>
              <TableHead>Non-billable</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>A carregar...</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              rows.map((row) => (
                <TableRow key={`${row.project}-${row.user}`}>
                  <TableCell>{row.project}</TableCell>
                  <TableCell>{row.client}</TableCell>
                  <TableCell>{(row.total_minutes / 60).toFixed(1)}h</TableCell>
                  <TableCell>{(row.billable_minutes / 60).toFixed(1)}h</TableCell>
                  <TableCell>{(row.non_billable_minutes / 60).toFixed(1)}h</TableCell>
                  <TableCell>
                    {Number(row.total_amount ?? 0).toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR"
                    })}
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>Sem dados para o filtro seleccionado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

