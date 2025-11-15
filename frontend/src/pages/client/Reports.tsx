import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ClientReportsFilters, type BillableFilter } from "@/components/clients/pages/reports/ClientReportsFilters";
import { ClientReportsHeader } from "@/components/clients/pages/reports/ClientReportsHeader";
import { ClientReportsSummary } from "@/components/clients/pages/reports/ClientReportsSummary";
import { ClientReportsTable } from "@/components/clients/pages/reports/ClientReportsTable";
import { fetchReportSummary } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";

export function ClientReportsPage() {
  const clientId = useAuthStore((state) =>
    state.user?.role === "CLIENT" && typeof state.user.client === "number" ? state.user.client : null
  );

  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [billableFilter, setBillableFilter] = useState<BillableFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const monthOptions = useMemo(() => {
    const now = new Date();
    const options = [];

    for (let i = 0; i < 12; i += 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric"
      });

      options.push({ value, label });
    }

    return options;
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["reports", "client", clientId, selectedMonth, billableFilter],
    queryFn: () => {
      const params: Record<string, string | number | undefined> = {
        client: clientId as number
      };

      if (selectedMonth !== "all") {
        const [year, month] = selectedMonth.split("-").map(Number);
        if (!Number.isNaN(year) && !Number.isNaN(month)) {
          const from = new Date(year, month - 1, 1);
          const to = new Date(year, month, 0);
          params.from = from.toISOString().slice(0, 10);
          params.to = to.toISOString().slice(0, 10);
        }
      }

      if (billableFilter === "billable") {
        params.billable = "true";
      } else if (billableFilter === "non-billable") {
        params.billable = "false";
      }

      return fetchReportSummary(params);
    },
    enabled: typeof clientId === "number"
  });

  const rows = data ?? [];

  const filteredRows = rows.filter((row) => {
    if (!searchTerm.trim()) {
      return true;
    }
    const query = searchTerm.trim().toLowerCase();
    const projectName = row.project?.toLowerCase() ?? "";
    return projectName.includes(query);
  });

  const metrics = filteredRows.reduce(
    (acc, row) => {
      acc.totalHours += row.total_minutes / 60;
      acc.billableHours += row.billable_minutes / 60;
      acc.nonBillableHours += row.non_billable_minutes / 60;

      if (row.total_amount !== null && row.total_amount !== undefined) {
        const numeric = typeof row.total_amount === "string" ? Number(row.total_amount) : row.total_amount;
        if (!Number.isNaN(numeric)) {
          acc.totalAmount += numeric;
        }
      }

      return acc;
    },
    {
      totalHours: 0,
      billableHours: 0,
      nonBillableHours: 0,
      totalAmount: 0
    }
  );

  const handleResetFilters = () => {
    setSelectedMonth("all");
    setBillableFilter("all");
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      <ClientReportsHeader />
      <ClientReportsFilters
        monthOptions={monthOptions}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        billableFilter={billableFilter}
        onBillableFilterChange={setBillableFilter}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onReset={handleResetFilters}
      />
      <ClientReportsSummary metrics={metrics} />
      <ClientReportsTable rows={filteredRows} isLoading={isLoading} />
    </div>
  );
}


