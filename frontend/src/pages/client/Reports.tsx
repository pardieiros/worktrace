import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { fetchReportSummary } from "@/lib/queries";

export function ClientReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["reports", "client"],
    queryFn: () => fetchReportSummary()
  });

  const rows = data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-text">Relatórios</h1>
        <p className="text-sm text-primary/70">
          Visão transparente das horas por projeto, sem possibilidade de edição.
        </p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead>Horas totais</TableHead>
              <TableHead>Billable</TableHead>
              <TableHead>Non-billable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>A carregar...</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              rows.map((row) => (
                <TableRow key={`${row.project}-${row.user}`}>
                  <TableCell>{row.project}</TableCell>
                  <TableCell>{(row.total_minutes / 60).toFixed(1)}h</TableCell>
                  <TableCell>{(row.billable_minutes / 60).toFixed(1)}h</TableCell>
                  <TableCell>{(row.non_billable_minutes / 60).toFixed(1)}h</TableCell>
                </TableRow>
              ))}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>Sem dados disponíveis.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

