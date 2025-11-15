import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TimeEntry } from "@/lib/types";

type TimeEntryDetailDialogProps = {
  entry: TimeEntry | null;
  isOpen: boolean;
  locale: string;
  onClose: () => void;
};

export function TimeEntryDetailDialog({
  entry,
  isOpen,
  locale,
  onClose
}: TimeEntryDetailDialogProps) {
  const { t } = useTranslation();

  if (!isOpen || entry === null) {
    return null;
  }

  const parsedDate = new Date(entry.date);
  const createdAtLabel = entry.created_at ? new Date(entry.created_at).toLocaleTimeString(locale) : null;
  const formatTime = (value: string | null) => {
    if (!value) {
      return null;
    }
    const [time] = value.split(".");
    return time ?? value;
  };

  const startTime = formatTime(entry.start);
  const endTime = formatTime(entry.end);
  const resolveCurrency = () => entry.currency ?? "EUR";
  const formatMoney = (value?: string | null) => {
    if (!value) {
      return null;
    }
    const numeric = Number(value);
    const currency = resolveCurrency();
    if (Number.isNaN(numeric)) {
      return `${value} ${currency}`;
    }
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency
      }).format(numeric);
    } catch {
      return `${numeric.toFixed(2)} ${currency}`;
    }
  };

  const formattedHourlyRate = formatMoney(entry.hourly_rate);
  const formattedAmount = formatMoney(entry.amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <Card className="w-full max-w-2xl space-y-6 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-primary/10 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-text">{entry.project_name}</h2>
            <p className="text-sm text-primary/70">{entry.user_email}</p>
            <p className="text-xs text-primary/60">
              {parsedDate.toLocaleDateString(locale)}
              {createdAtLabel ? ` • ${createdAtLabel}` : ""}
            </p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.actions.close")}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
            <h3 className="text-sm font-semibold text-text">
              {t("admin.timeEntries.details.overview")}
            </h3>
            <dl className="space-y-2 text-sm text-primary/80">
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.timeEntries.details.duration")}
                </dt>
                <dd>{(entry.duration_minutes / 60).toFixed(2)}h</dd>
              </div>
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.timeEntries.details.billable")}
                </dt>
                <dd>
                  {entry.billable
                    ? t("admin.timeEntries.table.billableYes")
                    : t("admin.timeEntries.table.billableNo")}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.timeEntries.details.timeRange")}
                </dt>
                <dd>
                  {startTime && endTime
                    ? `${startTime} - ${endTime}`
                    : t("admin.timeEntries.details.timeRangeFallback")}
                </dd>
              </div>
              {formattedHourlyRate && (
                <div>
                  <dt className="font-medium text-primary/90">
                    {t("admin.timeEntries.details.hourlyRate")}
                  </dt>
                  <dd>{formattedHourlyRate}</dd>
                </div>
              )}
              {formattedAmount && (
                <div>
                  <dt className="font-medium text-primary/90">
                    {t("admin.timeEntries.details.amount")}
                  </dt>
                  <dd>{formattedAmount}</dd>
                </div>
              )}
            </dl>
          </div>
          <div className="space-y-2 rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
            <h3 className="text-sm font-semibold text-text">
              {t("admin.timeEntries.details.meta")}
            </h3>
            <dl className="space-y-2 text-sm text-primary/80">
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.timeEntries.details.client")}
                </dt>
                <dd>{entry.client_name ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-primary/90">
                  {t("admin.timeEntries.details.task")}
                </dt>
                <dd>{entry.task || "—"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
          <h3 className="text-sm font-semibold text-text">
            {t("admin.timeEntries.details.summaryTitle")}
          </h3>
          <p className="whitespace-pre-line text-sm text-primary/80">{entry.notes || "—"}</p>
        </div>
      </Card>
    </div>
  );
}

