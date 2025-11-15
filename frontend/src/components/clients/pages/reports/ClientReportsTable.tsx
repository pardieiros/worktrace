import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ReportSummary } from "@/lib/types";

interface ClientReportsTableProps {
  rows: ReportSummary[];
  isLoading: boolean;
}

function toHours(minutes: number) {
  return (minutes / 60).toFixed(1);
}

function formatAmount(amount: ReportSummary["total_amount"], locale: string) {
  if (amount === null || amount === undefined) {
    return "—";
  }

  const parsedAmount = typeof amount === "string" ? Number(amount) : amount;

  if (Number.isNaN(parsedAmount)) {
    return amount.toString();
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parsedAmount);
}

export function ClientReportsTable({ rows, isLoading }: ClientReportsTableProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <Card className="border border-primary/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("client.reports.table.project")}</TableHead>
            <TableHead>{t("client.reports.table.hours")}</TableHead>
            <TableHead>{t("client.reports.table.billable")}</TableHead>
            <TableHead>{t("client.reports.table.nonBillable")}</TableHead>
            <TableHead>{t("client.reports.table.amount")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5}>{t("common.loading")}</TableCell>
            </TableRow>
          )}
          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>{t("client.reports.table.empty")}</TableCell>
            </TableRow>
          )}
          {!isLoading &&
            rows.map((row) => (
              <TableRow key={`${row.project ?? "unknown"}-${row.user ?? "client"}`}>
                <TableCell>{row.project || t("client.reports.table.projectUnknown", "—")}</TableCell>
                <TableCell>{toHours(row.total_minutes)}h</TableCell>
                <TableCell>{toHours(row.billable_minutes)}h</TableCell>
                <TableCell>{toHours(row.non_billable_minutes)}h</TableCell>
                <TableCell>{formatAmount(row.total_amount, locale)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}


