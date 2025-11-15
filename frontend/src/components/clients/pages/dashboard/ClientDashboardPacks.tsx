import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface ClientPackProgress {
  id: number;
  name: string;
  totalHours: number;
  usedHours: number;
  currency: string;
  totalValue?: number | null;
}

function formatHours(hours: number, locale: string) {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(hours);
}

function formatCurrency(amount: number | null | undefined, locale: string, currency: string) {
  if (amount === null || amount === undefined) {
    return "—";
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "EUR",
    currencyDisplay: "symbol"
  }).format(amount);
}

export function ClientDashboardPacks({ packs, isLoading }: { packs: ClientPackProgress[]; isLoading: boolean }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  if (isLoading) {
    return (
      <Card className="border border-primary/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text">{t("client.dashboard.packs.title")}</h2>
        <Skeleton className="mt-4 h-24 w-full rounded-lg" />
      </Card>
    );
  }

  if (!packs.length) {
    return (
      <Card className="border border-primary/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text">{t("client.dashboard.packs.title")}</h2>
        <p className="mt-2 text-sm text-primary/70">{t("client.dashboard.packs.empty")}</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 border border-primary/10 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-text">{t("client.dashboard.packs.title")}</h2>
        <p className="text-sm text-primary/70">{t("client.dashboard.packs.subtitle")}</p>
      </div>

      <div className="space-y-4">
        {packs.map((pack) => {
          const progress =
            pack.totalHours > 0 ? Math.min(100, (pack.usedHours / pack.totalHours) * 100) : undefined;
          return (
            <div key={pack.id} className="space-y-3 rounded-lg border border-primary/10 p-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-primary/70">{pack.name}</p>
                  <p className="text-lg font-semibold text-text">
                    {formatHours(pack.usedHours, locale)}h{" "}
                    <span className="text-sm font-medium text-primary/60">
                      / {pack.totalHours ? `${formatHours(pack.totalHours, locale)}h` : t("client.dashboard.packs.noLimit")}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-primary/70">
                  {t("client.dashboard.packs.totalValue", {
                    value: formatCurrency(pack.totalValue ?? null, locale, pack.currency || "EUR")
                  })}
                </p>
              </div>

              {progress !== undefined ? (
                <div className="h-2 w-full rounded-full bg-primary/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : (
                <p className="text-xs text-primary/60">
                  {t("client.dashboard.packs.noHoursDefined", "Pack hours not defined for this project.")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}


