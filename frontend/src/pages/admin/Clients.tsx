import type { ChangeEvent, FormEvent } from "react";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient, fetchClients } from "@/lib/queries";
import type { CreateClientPayload, CreateClientResponse } from "@/lib/queries";
import type { Client, PaginatedResponse } from "@/lib/types";

type FormState = {
  name: string;
  email: string;
  vat: string;
  notes: string;
  brandingLogo: File | null;
};

export function AdminClientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdClientInfo, setCreatedClientInfo] = useState<CreateClientResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formValues, setFormValues] = useState<FormState>({
    name: "",
    email: "",
    vat: "",
    notes: "",
    brandingLogo: null
  });

  const { data, isLoading } = useQuery<PaginatedResponse<Client>>({
    queryKey: ["clients", { search }],
    queryFn: () => fetchClients()
  });

  const createClientMutation = useMutation({
    mutationFn: async (payload: CreateClientPayload) => createClient(payload),
    onSuccess: (client) => {
      setErrorMessage(null);
      setCreatedClientInfo(client);
      setFormValues({
        name: "",
        email: "",
        vat: "",
        notes: "",
        brandingLogo: null
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: unknown) => {
      let message = "Não foi possível criar o cliente. Tenta novamente.";
      if (isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string") {
          message = detail;
        } else if (error.response?.data && typeof error.response.data === "object") {
          const values = Object.values(error.response.data);
          if (values.length > 0 && typeof values[0] === "string") {
            message = values[0];
          }
        }
      }
      setErrorMessage(message);
    }
  });

  const handleInputChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((previous) => ({
        ...previous,
        [field]: event.target.value
      }));
    };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setErrorMessage(null);
    setCreatedClientInfo(null);
    setFormValues({
      name: "",
      email: "",
      vat: "",
      notes: "",
      brandingLogo: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage(null);
    setCreatedClientInfo(null);
    setFormValues({
      name: "",
      email: "",
      vat: "",
      notes: "",
      brandingLogo: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = formValues.name.trim();
    const trimmedEmail = formValues.email.trim();
    if (!trimmedName || !trimmedEmail) {
      setErrorMessage("Nome e email são obrigatórios.");
      return;
    }

    const payload: CreateClientPayload = {
      name: trimmedName,
      email: trimmedEmail,
      ...(formValues.vat.trim() ? { vat: formValues.vat.trim() } : {}),
      ...(formValues.notes.trim() ? { notes: formValues.notes.trim() } : {}),
      ...(formValues.brandingLogo ? { branding_logo: formValues.brandingLogo } : {})
    };

    createClientMutation.mutate(payload);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFormValues((previous) => ({
      ...previous,
      brandingLogo: file
    }));
  };

  const handleRemoveFile = () => {
    setFormValues((previous) => ({
      ...previous,
      brandingLogo: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyPassword = async () => {
    if (createdClientInfo?.initial_password) {
      try {
        await navigator.clipboard.writeText(createdClientInfo.initial_password);
      } catch {
        // ignore clipboard errors silently
      }
    }
  };

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
        <Button type="button" onClick={handleOpenModal}>
          Adicionar cliente
        </Button>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <Card className="w-full max-w-xl p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text">Adicionar novo cliente</h2>
                <p className="text-sm text-primary/70">
                  Define os detalhes do cliente e partilha a password temporária.
                </p>
              </div>
              <Button type="button" variant="ghost" onClick={handleCloseModal}>
                Fechar
              </Button>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {errorMessage}
              </div>
            )}

            {createdClientInfo?.initial_password ? (
              <div className="mb-6 rounded-lg border border-success/40 bg-success/10 px-4 py-4">
                <p className="font-medium text-success">Cliente criado com sucesso.</p>
                <p className="mt-2 text-sm text-primary/80">
                  Password temporária para <span className="font-semibold">{createdClientInfo.email}</span>:
                </p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <code className="rounded-md bg-white px-3 py-2 font-mono text-sm text-text shadow-sm">
                    {createdClientInfo.initial_password}
                  </code>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleCopyPassword}>
                      Copiar password
                    </Button>
                    <Button type="button" size="sm" onClick={handleCloseModal}>
                      Concluir
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-primary/70">
                  Pede ao cliente para alterar a password no primeiro acesso.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Nome</Label>
                    <Input
                      id="client-name"
                      value={formValues.name}
                      onChange={handleInputChange("name")}
                      placeholder="Ex. Empresa XPTO"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={formValues.email}
                      onChange={handleInputChange("email")}
                      placeholder="cliente@empresa.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client-vat">NIF/VAT</Label>
                    <Input
                      id="client-vat"
                      value={formValues.vat}
                      onChange={handleInputChange("vat")}
                      placeholder="Opcional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-notes">Notas</Label>
                    <textarea
                      id="client-notes"
                      value={formValues.notes}
                      onChange={handleInputChange("notes")}
                      className="h-24 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Informação adicional para a equipa interna."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-logo">Logo do cliente</Label>
                  <Input
                    id="client-logo"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {formValues.brandingLogo && (
                    <div className="flex items-center gap-2 text-xs text-primary/70">
                      <span>Selecionado: {formValues.brandingLogo.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                        Remover
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-primary/60">
                    Aceita formatos de imagem (PNG, JPG, SVG). Máx. 5MB.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={handleCloseModal} disabled={createClientMutation.isPending}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createClientMutation.isPending}>
                    {createClientMutation.isPending ? "A criar..." : "Guardar cliente"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

