import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

export interface ClientReportsSummaryMetrics {
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  totalAmount: number;
}

function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function ClientReportsSummary({ metrics }: { metrics: ClientReportsSummaryMetrics }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const summaryItems = [
    {
      label: t("client.reports.summary.totalHours"),
      value: formatNumber(metrics.totalHours, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      suffix: "h"
    },
    {
      label: t("client.reports.summary.billableHours"),
      value: formatNumber(metrics.billableHours, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      suffix: "h"
    },
    {
      label: t("client.reports.summary.nonBillableHours"),
      value: formatNumber(metrics.nonBillableHours, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      suffix: "h"
    },
    {
      label: t("client.reports.summary.totalAmount"),
      value: formatNumber(metrics.totalAmount, locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {summaryItems.map((item) => (
        <Card key={item.label} className="space-y-2 border border-primary/10 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-primary/70">{item.label}</p>
          <p className="text-2xl font-semibold text-text">
            {item.value}
            {item.suffix ? <span className="ml-1 text-base font-medium text-primary/60">{item.suffix}</span> : null}
          </p>
        </Card>
      ))}
    </div>
  );
}


