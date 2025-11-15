import type { ChangeEvent } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { Client } from "@/lib/types";

type ClientsListProps = {
  clients: Client[];
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectClient: (clientId: number) => void;
};

export function ClientsList({
  clients,
  isLoading,
  search,
  onSearchChange,
  onSelectClient
}: ClientsListProps) {
  const { t } = useTranslation();

  const filteredClients = useMemo(
    () =>
      clients.filter((client) => client.name.toLowerCase().includes(search.toLowerCase())),
    [clients, search]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Input
          placeholder={t("admin.clients.list.searchPlaceholder")}
          value={search}
          onChange={handleSearchChange}
          aria-label={t("admin.clients.list.searchAria")}
          className="max-w-sm"
        />
        <p className="text-sm text-primary/70">
          {t("admin.clients.list.count", { count: filteredClients.length })}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.clients.table.client")}</TableHead>
            <TableHead>{t("admin.clients.table.email")}</TableHead>
            <TableHead>{t("admin.clients.table.vat")}</TableHead>
            <TableHead>{t("admin.clients.table.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4}>{t("common.loading")}</TableCell>
            </TableRow>
          )}
          {!isLoading &&
            filteredClients.map((client) => (
              <TableRow
                key={client.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectClient(client.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectClient(client.id);
                  }
                }}
                aria-label={t("admin.clients.list.openDetail", { name: client.name })}
                className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <TableCell>{client.name}</TableCell>
                <TableCell>
                  <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                    {client.email}
                  </a>
                </TableCell>
                <TableCell>{client.vat || "—"}</TableCell>
                <TableCell>
                  {client.is_active ? t("common.status.active") : t("common.status.inactive")}
                </TableCell>
              </TableRow>
            ))}
          {!isLoading && filteredClients.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>{t("admin.clients.table.empty")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

