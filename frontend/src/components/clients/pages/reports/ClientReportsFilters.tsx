import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type BillableFilter = "all" | "billable" | "non-billable";

export interface MonthOption {
  value: string;
  label: string;
}

interface ClientReportsFiltersProps {
  monthOptions: MonthOption[];
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  billableFilter: BillableFilter;
  onBillableFilterChange: (value: BillableFilter) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onReset: () => void;
}

export function ClientReportsFilters({
  monthOptions,
  selectedMonth,
  onMonthChange,
  billableFilter,
  onBillableFilterChange,
  searchTerm,
  onSearchTermChange,
  onReset
}: ClientReportsFiltersProps) {
  const { t } = useTranslation();

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onMonthChange(event.target.value);
  };

  const handleBillableChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onBillableFilterChange(event.target.value as BillableFilter);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-primary/10 bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between">
      <div className="grid flex-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="client-reports-month">{t("client.reports.filters.monthLabel")}</Label>
          <select
            id="client-reports-month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="h-10 rounded-md border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">{t("client.reports.filters.monthAll")}</option>
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="client-reports-billable">{t("client.reports.filters.billableLabel")}</Label>
          <select
            id="client-reports-billable"
            value={billableFilter}
            onChange={handleBillableChange}
            className="h-10 rounded-md border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">{t("client.reports.filters.billableAll")}</option>
            <option value="billable">{t("client.reports.filters.billableOnly")}</option>
            <option value="non-billable">{t("client.reports.filters.nonBillableOnly")}</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="client-reports-search">{t("client.reports.filters.searchLabel")}</Label>
          <Input
            id="client-reports-search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t("client.reports.filters.searchPlaceholder")}
          />
        </div>
      </div>

      <button
        type="button"
        className="h-10 rounded-md border border-primary/20 px-4 text-sm font-medium text-primary transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={onReset}
      >
        {t("client.reports.filters.reset")}
      </button>
    </div>
  );
}


