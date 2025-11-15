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
import type { TooltipProps } from "recharts";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProjects, fetchReportSummary } from "@/lib/queries";
import type { ReportSummary } from "@/lib/types";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

interface ProjectHoursTooltipProps extends TooltipProps<number, string> {
  translate: TranslateFn;
}

function ProjectHoursTooltip({ active, payload, label, translate }: ProjectHoursTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const billable = payload.find((item) => item.dataKey === "billable");
  const nonBillable = payload.find((item) => item.dataKey === "nonBillable");
  const totalHours =
    payload.reduce((acc, item) => acc + (Number(item.value ?? 0) || 0), 0) ?? 0;

  return (
    <div className="rounded-xl border border-primary/10 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-primary/70">{label}</p>
      <div className="mt-2 space-y-1 text-sm">
        {billable && (
          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-text/80">
              <span
                className="inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: billable.color }}
              />
              {translate("admin.dashboard.chart.billable", { defaultValue: "Billable" })}
            </span>
            <span className="font-semibold text-text">
              {Number(billable.value ?? 0).toFixed(1)}h
            </span>
          </div>
        )}
        {nonBillable && (
          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-text/80">
              <span
                className="inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: nonBillable.color }}
              />
              {translate("admin.dashboard.chart.nonBillable", { defaultValue: "Non-billable" })}
            </span>
            <span className="font-semibold text-text">
              {Number(nonBillable.value ?? 0).toFixed(1)}h
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-medium text-primary/80">
        <span>{translate("admin.dashboard.chart.total", { defaultValue: "Total" })}</span>
        <span>{totalHours.toFixed(1)}h</span>
      </div>
    </div>
  );
}

function ChartLegend({
  payload,
  translate
}: {
  payload?: Array<{ dataKey?: string | number; value?: string; color?: string }>;
  translate: TranslateFn;
}) {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-primary/80">
      {payload.map((entry, index) => (
        <div
          key={String(entry.dataKey ?? entry.value ?? `legend-${index}`)}
          className="flex items-center gap-2"
        >
          <span
            className="inline-flex h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>
            {entry.value === "billable"
              ? translate("admin.dashboard.chart.billable", { defaultValue: "Billable" })
              : translate("admin.dashboard.chart.nonBillable", { defaultValue: "Non-billable" })}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboardPage() {
  const { data: projectsData, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects", { limit: 5 }],
    queryFn: () => fetchProjects({ page_size: 5 })
  });
  const { data: reportData, isLoading: loadingReport } = useQuery({
    queryKey: ["reports", "summary"],
    queryFn: () => fetchReportSummary({ limit: 10 })
  });
  const { t } = useTranslation();

  const totals = useMemo(() => {
    if (!reportData) {
      return {
        totalHours: "0.0",
        billableHours: "0.0",
        nonBillableHours: "0.0",
        totalAmount: 0
      };
    }
    const totalMinutes = reportData.reduce((acc, item) => acc + item.total_minutes, 0);
    const billable = reportData.reduce((acc, item) => acc + item.billable_minutes, 0);
    const nonBillable = reportData.reduce((acc, item) => acc + item.non_billable_minutes, 0);
    const totalAmount = reportData.reduce(
      (acc, item) => acc + Number(item.total_amount ?? 0),
      0
    );
    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      billableHours: (billable / 60).toFixed(1),
      nonBillableHours: (nonBillable / 60).toFixed(1),
      totalAmount
    };
  }, [reportData]);

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "EUR"
    });
  }, []);

  const chartData = useMemo(() => {
    if (!reportData) return [];
    return reportData.map((item: ReportSummary) => ({
      name: item.project ?? t("admin.dashboard.chart.unknownProject"),
      billable: Number((item.billable_minutes / 60).toFixed(2)),
      nonBillable: Number((item.non_billable_minutes / 60).toFixed(2))
    }));
  }, [reportData, t]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <p className="text-sm text-primary/70">{t("admin.dashboard.cards.totalHours")}</p>
          {loadingReport ? (
            <Skeleton className="mt-4 h-8 w-28" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-text">{totals.totalHours}h</p>
          )}
        </Card>
        <Card className="flex-1">
          <p className="text-sm text-primary/70">{t("admin.dashboard.cards.billable")}</p>
          {loadingReport ? (
            <Skeleton className="mt-4 h-8 w-28" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-success">{totals.billableHours}h</p>
          )}
        </Card>
        <Card className="flex-1">
          <p className="text-sm text-primary/70">{t("admin.dashboard.cards.nonBillable")}</p>
          {loadingReport ? (
            <Skeleton className="mt-4 h-8 w-28" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-danger">{totals.nonBillableHours}h</p>
          )}
        </Card>
        <Card className="flex-1">
          <p className="text-sm text-primary/70">{t("admin.dashboard.cards.billedAmount")}</p>
          {loadingReport ? (
            <Skeleton className="mt-4 h-8 w-36" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-text">
              {currencyFormatter.format(totals.totalAmount)}
            </p>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-text">{t("admin.dashboard.sections.byProject.title")}</h2>
        <p className="text-sm text-primary/70">{t("admin.dashboard.sections.byProject.description")}</p>
        <div className="mt-6 h-80">
          {loadingReport ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <defs>
                  <linearGradient id="billableGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="nonBillableGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#FDBA74" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 8" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                  tickFormatter={(value: number) => `${value}h`}
                  width={56}
                />
                <Tooltip
                  content={<ProjectHoursTooltip translate={t} />}
                  cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
                />
                <Legend
                  align="left"
                  verticalAlign="bottom"
                  content={<ChartLegend translate={t} />}
                />
                <Bar
                  dataKey="billable"
                  fill="url(#billableGradient)"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="nonBillable"
                  fill="url(#nonBillableGradient)"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">{t("admin.dashboard.sections.activeProjects.title")}</h2>
            <p className="text-sm text-primary/70">{t("admin.dashboard.sections.activeProjects.description")}</p>
          </div>
          <Badge>{t("admin.dashboard.sections.activeProjects.badge")}</Badge>
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
                  <p className="text-xs text-primary/70">
                    {t("admin.dashboard.sections.activeProjects.updated", {
                      date: new Date(project.updated_at).toLocaleDateString()
                    })}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}


