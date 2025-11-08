import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchClients } from "@/lib/queries";
import type { Client } from "@/lib/types";

export function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["clients", { search }],
    queryFn: () => fetchClients(),
    keepPreviousData: true
  });

  const clients = data?.results ?? [];
  const filtered = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Clientes</h1>
          <p className="text-sm text-primary/70">Gestão de clientes com estatuto e contactos.</p>
        </div>
        <Button>Adicionar cliente</Button>
      </div>
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Input
            placeholder="Procurar por nome ou email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Pesquisa de clientes"
            className="max-w-sm"
          />
          <p className="text-sm text-primary/70">{filtered.length} clientes visíveis</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>NIF/VAT</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>A carregar...</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              filtered.map((client: Client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                      {client.email}
                    </a>
                  </TableCell>
                  <TableCell>{client.vat || "—"}</TableCell>
                  <TableCell>{client.is_active ? "Ativo" : "Inativo"}</TableCell>
                </TableRow>
              ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>Sem resultados para a pesquisa.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

