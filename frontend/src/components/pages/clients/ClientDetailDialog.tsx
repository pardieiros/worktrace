import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ClientPaymentModal } from "@/components/pages/clients/ClientPaymentModal";
import {
  fetchClientAccount
} from "@/lib/queries";
import type { ClientAccountSummary } from "@/lib/types";

import {
  formatCurrency,
  formatDate
} from "./utils";

type ClientDetailDialogProps = {
  clientId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ClientDetailDialog({ clientId, isOpen, onClose }: ClientDetailDialogProps) {
  const { t } = useTranslation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPaymentModalOpen(false);
    }
  }, [isOpen]);

  const clientAccountQuery = useQuery<ClientAccountSummary>({
    queryKey: ["client-account", clientId],
    queryFn: () => fetchClientAccount(clientId as number),
    enabled: Boolean(isOpen && clientId !== null)
  });

  const accountData = clientAccountQuery.data;
  const isAccountLoading = clientAccountQuery.isLoading || clientAccountQuery.isFetching;
  const accountEntries = accountData?.entries ?? [];
  const accountCurrency = accountData?.currency ?? "EUR";
  const clientDetails = accountData?.client ?? null;
  const packProjects = accountData?.pack_projects ?? [];
  const hourlyProjects = accountData?.hourly_projects ?? [];
  const balanceFormatted = accountData ? formatCurrency(accountData.balance, accountCurrency) : "—";
  const chargedFormatted = accountData ? formatCurrency(accountData.total_charged, accountCurrency) : "—";
  const paidFormatted = accountData ? formatCurrency(accountData.total_paid, accountCurrency) : "—";
  const packTotalFormatted = accountData
    ? formatCurrency(accountData.pack_total_due, accountCurrency)
    : "—";
  const hourlyTotalFormatted = accountData
    ? formatCurrency(accountData.hourly_total_due, accountCurrency)
    : "—";
  const clientStatusLabel = clientDetails
    ? clientDetails.is_active
      ? t("common.status.active")
      : t("common.status.inactive")
    : "—";
  const accountError = clientAccountQuery.error;
  const accountErrorMessage =
    accountError && isAxiosError(accountError) && typeof accountError.response?.data?.detail === "string"
      ? accountError.response?.data?.detail
      : accountError
        ? t("admin.clients.details.account.errors.loadFallback")
        : null;

  const summaryMetrics = useMemo(() => {
    const metrics = [
      {
        label: t("admin.clients.details.account.balanceLabel"),
        value: balanceFormatted
      },
      {
        label: t("admin.clients.details.account.chargedLabel"),
        value: chargedFormatted
      },
      {
        label: t("admin.clients.details.account.paidLabel"),
        value: paidFormatted
      }
    ];

    if (hourlyProjects.length > 0) {
      metrics.push({
        label: t("admin.clients.details.account.hourlyLabel"),
        value: hourlyTotalFormatted
      });
    }

    if (packProjects.length > 0) {
      metrics.push({
        label: t("admin.clients.details.account.packLabel"),
        value: packTotalFormatted
      });
    }

    return metrics;
  }, [
    balanceFormatted,
    chargedFormatted,
    hourlyProjects.length,
    hourlyTotalFormatted,
    packProjects.length,
    packTotalFormatted,
    paidFormatted,
    t
  ]);

  if (!isOpen || clientId === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <Card className="flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden p-0 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-primary/10 bg-primary/5 px-6 py-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-text">
                {clientDetails?.name ?? t("admin.clients.details.title")}
              </h2>
              {clientDetails && (
                <Badge variant={clientDetails.is_active ? "success" : "danger"}>
                  {clientStatusLabel}
                </Badge>
              )}
            </div>
            <p className="text-sm text-primary/70">{t("admin.clients.details.subtitle")}</p>
            {clientDetails && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-primary/80">
                <a
                  href={`mailto:${clientDetails.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {clientDetails.email}
                </a>
                <span className="hidden text-primary/40 sm:inline">•</span>
                <span className="font-medium text-primary/80">
                  {clientDetails.vat || t("admin.clients.details.about.noVat")}
                </span>
                <span className="hidden text-primary/40 sm:inline">•</span>
                <span className="text-primary/70">
                  {t("admin.clients.details.about.createdAt")} {formatDate(clientDetails.created_at)}
                </span>
              </div>
            )}
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.actions.close")}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isAccountLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-primary/70">{t("common.loading")}</p>
            </div>
          )}

          {!isAccountLoading && accountErrorMessage && (
            <div className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
              {accountErrorMessage}
            </div>
          )}

          {!isAccountLoading && !accountErrorMessage && (
            <div className="space-y-6">
              {clientDetails && (
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="rounded-xl border border-primary/10 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-text">
                      {t("admin.clients.details.about.heading")}
                    </h3>
                    <dl className="mt-4 space-y-3 text-sm text-primary/80">
                      <div className="flex flex-col gap-1">
                        <dt className="font-medium text-primary/90">
                          {t("admin.clients.details.about.email")}
                        </dt>
                        <dd>
                          <a
                            href={`mailto:${clientDetails.email}`}
                            className="text-primary hover:underline"
                          >
                            {clientDetails.email}
                          </a>
                        </dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="font-medium text-primary/90">
                          {t("admin.clients.details.about.vat")}
                        </dt>
                        <dd>{clientDetails.vat || t("admin.clients.details.about.noVat")}</dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="font-medium text-primary/90">
                          {t("admin.clients.details.about.notes")}
                        </dt>
                        <dd className="whitespace-pre-line text-primary/70">
                          {clientDetails.notes || t("admin.clients.details.about.noNotes")}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="font-medium text-primary/90">
                          {t("admin.clients.details.about.updatedAt")}
                        </dt>
                        <dd>{formatDate(clientDetails.updated_at)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-xl border border-primary/10 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-text">
                          {t("admin.clients.details.account.heading")}
                        </h3>
                        <p className="text-sm text-primary/70">
                          {t("admin.clients.details.account.description")}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setIsPaymentModalOpen(true)}
                        disabled={!clientDetails}
                      >
                        {t("admin.clients.details.account.paymentForm.title")}
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {summaryMetrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-lg border border-primary/10 bg-primary/5 p-4"
                        >
                          <p className="text-xs font-medium uppercase tracking-wide text-primary/70">
                            {metric.label}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-text">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text">
                      {t("admin.clients.details.account.historyHeading")}
                    </h3>
                    <p className="text-sm text-primary/70">
                      {t("admin.clients.details.account.table.description")}
                    </p>
                  </div>
                  {accountEntries.length > 0 && (
                    <Badge variant="neutral">{accountEntries.length}</Badge>
                  )}
                </div>
                {accountEntries.length === 0 ? (
                  <p className="mt-4 text-sm text-primary/70">
                    {t("admin.clients.details.account.empty")}
                  </p>
                ) : (
                  <div className="mt-4 overflow-hidden rounded-xl border border-primary/10">
                    <div className="max-h-64 overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("admin.clients.details.account.table.date")}</TableHead>
                            <TableHead>{t("admin.clients.details.account.table.type")}</TableHead>
                            <TableHead>
                              {t("admin.clients.details.account.table.description")}
                            </TableHead>
                            <TableHead>
                              {t("admin.clients.details.account.table.reference")}
                            </TableHead>
                            <TableHead className="text-right">
                              {t("admin.clients.details.account.table.amount")}
                            </TableHead>
                            <TableHead>
                              {t("admin.clients.details.account.table.recordedBy")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {accountEntries.map((entry) => {
                            const amountToFormat =
                              entry.entry_type === "payment"
                                ? `-${entry.amount}`
                                : entry.amount;
                            return (
                              <TableRow key={entry.id}>
                                <TableCell>{formatDate(entry.occurred_at)}</TableCell>
                                <TableCell>
                                  {t(
                                    `admin.clients.details.account.entryTypes.${entry.entry_type}`
                                  )}
                                </TableCell>
                                <TableCell>
                                  {entry.description ||
                                    t("admin.clients.details.account.noDescription")}
                                </TableCell>
                                <TableCell>{entry.reference || "—"}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(amountToFormat, entry.currency)}
                                </TableCell>
                                <TableCell>{entry.recorded_by_name || "—"}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>

              {packProjects.length > 0 && (
                <div className="rounded-xl border border-primary/10 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-text">
                    {t("admin.clients.details.account.packsHeading")}
                  </h3>
                  <p className="text-sm text-primary/70">
                    {t("admin.clients.details.account.packsDescription")}
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {packProjects.map((project) => {
                      const amountFormatted = formatCurrency(project.pack_total_value, project.currency);
                      const hoursLabel = project.pack_hours
                        ? t("admin.clients.details.account.packHours", {
                            hours: project.pack_hours
                          })
                        : t("admin.clients.details.account.packHoursFallback");
                      return (
                        <div
                          key={project.id}
                          className="rounded-lg border border-primary/10 bg-primary/5 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-text">{project.name}</p>
                              <p className="text-xs uppercase text-primary/70">{hoursLabel}</p>
                            </div>
                            <Badge variant="neutral">{project.currency}</Badge>
                          </div>
                          <p className="mt-3 text-lg font-semibold text-text">{amountFormatted}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {hourlyProjects.length > 0 && (
                <div className="rounded-xl border border-primary/10 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-text">
                    {t("admin.clients.details.account.hourlyHeading")}
                  </h3>
                  <p className="text-sm text-primary/70">
                    {t("admin.clients.details.account.hourlyDescription")}
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {hourlyProjects.map((project) => {
                      const amountFormatted = formatCurrency(project.amount, project.currency);
                      return (
                        <div
                          key={project.id}
                          className="rounded-lg border border-primary/10 bg-primary/5 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-text">{project.name}</p>
                              <p className="text-xs uppercase text-primary/70">
                                {t("admin.clients.details.account.hourlyHours", {
                                  hours: project.billable_hours
                                })}
                              </p>
                            </div>
                            <Badge variant="neutral">{project.currency}</Badge>
                          </div>
                          <p className="mt-3 text-lg font-semibold text-text">{amountFormatted}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
        <ClientPaymentModal
          clientId={clientId}
          isOpen={isPaymentModalOpen}
          currency={accountCurrency}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      </Card>
    </div>
  );
}

