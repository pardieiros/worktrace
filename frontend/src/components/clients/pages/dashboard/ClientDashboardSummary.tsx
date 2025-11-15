import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

export interface ClientDashboardSummaryMetrics {
  assignedProjects: number;
  totalHours: number;
  billableHours: number;
  outstandingBalance: {
    amount: number;
    currency: string;
  };
}

function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function ClientDashboardSummary({ metrics }: { metrics: ClientDashboardSummaryMetrics }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const cards = [
    {
      label: t("client.dashboard.cards.assignedProjects"),
      value: metrics.assignedProjects.toString()
    },
    {
      label: t("client.dashboard.cards.totalHours"),
      value: formatNumber(metrics.totalHours, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      suffix: "h"
    },
    {
      label: t("client.dashboard.cards.billableHours"),
      value: formatNumber(metrics.billableHours, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      suffix: "h"
    },
    {
      label: t("client.dashboard.cards.outstandingBalance"),
      value: formatNumber(metrics.outstandingBalance.amount, locale, {
        style: "currency",
        currency: metrics.outstandingBalance.currency || "EUR",
        currencyDisplay: "symbol"
      })
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="space-y-3 border border-primary/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-primary/70">{card.label}</p>
          <p className="text-3xl font-semibold text-text">
            {card.value}
            {card.suffix ? <span className="ml-1 text-base font-medium text-primary/60">{card.suffix}</span> : null}
          </p>
        </Card>
      ))}
    </div>
  );
}


