import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { TimeEntry } from "@/lib/types";

type TimeEntriesTableProps = {
  entries: TimeEntry[];
  isLoading: boolean;
  locale: string;
  onSelectEntry: (entry: TimeEntry) => void;
};

export function TimeEntriesTable({
  entries,
  isLoading,
  locale,
  onSelectEntry
}: TimeEntriesTableProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("admin.timeEntries.table.headers.date")}</TableHead>
          <TableHead>{t("admin.timeEntries.table.headers.project")}</TableHead>
          <TableHead>{t("admin.timeEntries.table.headers.user")}</TableHead>
          <TableHead>{t("admin.timeEntries.table.headers.task")}</TableHead>
          <TableHead>{t("admin.timeEntries.table.headers.duration")}</TableHead>
          <TableHead>{t("admin.timeEntries.table.headers.billable")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={6}>{t("admin.timeEntries.table.loading")}</TableCell>
          </TableRow>
        )}
        {!isLoading &&
          entries.map((entry) => (
            <TableRow
              key={entry.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectEntry(entry)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectEntry(entry);
                }
              }}
              className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <TableCell>{new Date(entry.date).toLocaleDateString(locale)}</TableCell>
              <TableCell>{entry.project_name}</TableCell>
              <TableCell>{entry.user_email}</TableCell>
              <TableCell>{entry.task}</TableCell>
              <TableCell>{(entry.duration_minutes / 60).toFixed(2)}h</TableCell>
              <TableCell>
                {entry.billable
                  ? t("admin.timeEntries.table.billableYes")
                  : t("admin.timeEntries.table.billableNo")}
              </TableCell>
            </TableRow>
          ))}
        {!isLoading && entries.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>{t("admin.timeEntries.table.empty")}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

