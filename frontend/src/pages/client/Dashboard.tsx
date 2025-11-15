import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { ClientDashboardDistribution } from "@/components/clients/pages/dashboard/ClientDashboardDistribution";
import { ClientDashboardHeader } from "@/components/clients/pages/dashboard/ClientDashboardHeader";
import { ClientDashboardPacks } from "@/components/clients/pages/dashboard/ClientDashboardPacks";
import { ClientDashboardSummary } from "@/components/clients/pages/dashboard/ClientDashboardSummary";
import { fetchClientAccount, fetchProjects, fetchReportSummary } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";

export function ClientDashboardPage() {
  const clientId = useAuthStore((state) =>
    state.user?.role === "CLIENT" && typeof state.user.client === "number" ? state.user.client : null
  );

  const {
    data: projectsData,
    isLoading: loadingProjects
  } = useQuery({
    queryKey: ["projects", "client", clientId],
    queryFn: () => fetchProjects({ client: clientId as number }),
    enabled: typeof clientId === "number"
  });

  const {
    data: reportData,
    isLoading: loadingReport
  } = useQuery({
    queryKey: ["reports", "client", clientId],
    queryFn: () => fetchReportSummary({ client: clientId as number }),
    enabled: typeof clientId === "number"
  });

  const {
    data: accountData,
    isLoading: loadingAccount
  } = useQuery({
    queryKey: ["client", clientId, "account"],
    queryFn: () => fetchClientAccount(clientId as number),
    enabled: typeof clientId === "number"
  });

  const { t } = useTranslation();

  const assignedProjects = projectsData?.results.length ?? 0;
  const totalHours = (reportData ?? []).reduce((acc, row) => acc + row.total_minutes / 60, 0);
  const billableHours = (reportData ?? []).reduce((acc, row) => acc + row.billable_minutes / 60, 0);

  const outstandingBalanceAmount = accountData?.balance ? Number(accountData.balance) : 0;
  const outstandingBalanceCurrency = accountData?.currency ?? "EUR";

  const summaryMetrics = {
    assignedProjects,
    totalHours,
    billableHours,
    outstandingBalance: {
      amount: Number.isFinite(outstandingBalanceAmount) ? outstandingBalanceAmount : 0,
      currency: outstandingBalanceCurrency
    }
  };

  const chartData = useMemo(() => {
    return (reportData ?? []).map((row) => ({
      name: row.project ?? t("client.dashboard.chart.unknownProject"),
      value: Number(((row.total_minutes ?? 0) / 60).toFixed(2))
    }));
  }, [reportData, t]);

  const packProgress = useMemo(() => {
    const packs = accountData?.pack_projects ?? [];
    const projectMap = new Map((projectsData?.results ?? []).map((project) => [project.id, project]));

    return packs.map((pack) => {
      const project = projectMap.get(pack.id);
      const totalHoursForPack = pack.pack_hours ? Number(pack.pack_hours) : 0;
      const usedHours = project?.total_logged_hours ?? 0;
      const totalValue = pack.pack_total_value ? Number(pack.pack_total_value) : null;
      const currency = project?.currency ?? accountData?.currency ?? "EUR";

      return {
        id: pack.id,
        name: pack.name,
        totalHours: Number.isFinite(totalHoursForPack) ? totalHoursForPack : 0,
        usedHours: Number.isFinite(usedHours) ? usedHours : 0,
        currency,
        totalValue
      };
    });
  }, [accountData?.pack_projects, accountData?.currency, projectsData?.results]);

  return (
    <div className="space-y-6">
      <ClientDashboardHeader />
      <ClientDashboardSummary metrics={summaryMetrics} />
      <ClientDashboardDistribution data={chartData} isLoading={loadingReport} />
      <ClientDashboardPacks packs={packProgress} isLoading={loadingAccount} />
    </div>
  );
}


