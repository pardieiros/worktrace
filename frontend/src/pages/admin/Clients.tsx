import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { ClientDetailDialog } from "@/components/pages/clients/ClientDetailDialog";
import { ClientsList } from "@/components/pages/clients/ClientsList";
import { CreateClientModal } from "@/components/pages/clients/CreateClientModal";
import { Button } from "@/components/ui/button";
import { fetchClients } from "@/lib/queries";
import type { Client, PaginatedResponse } from "@/lib/types";

export function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<PaginatedResponse<Client>>({
    queryKey: ["clients", { search }],
    queryFn: () => fetchClients()
  });

  const clients = data?.results ?? [];

  const handleSelectClient = (clientId: number) => {
    setSelectedClientId(clientId);
  };

  const handleCloseClientDetail = () => {
    setSelectedClientId(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">{t("admin.clients.title")}</h1>
          <p className="text-sm text-primary/70">{t("admin.clients.subtitle")}</p>
        </div>
        <Button type="button" onClick={handleOpenCreateModal}>
          {t("admin.clients.actions.add")}
        </Button>
      </div>

      <ClientsList
        clients={clients}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        onSelectClient={handleSelectClient}
      />

      <ClientDetailDialog
        clientId={selectedClientId}
        isOpen={selectedClientId !== null}
        onClose={handleCloseClientDetail}
      />

      <CreateClientModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
    </div>
  );
}

