import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createProject, fetchClients, fetchProjects, fetchTimeEntries } from "@/lib/queries";
import type { CreateProjectPayload } from "@/lib/queries";
import type {
  Client,
  PaginatedResponse,
  Project,
  ProjectStatus,
  ProjectVisibility,
  TimeEntry
} from "@/lib/types";
import { cn } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  archived: "Arquivado"
};

type BillingType = "hourly" | "pack";

type FormState = {
  name: string;
  clientId: string;
  description: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  billingType: BillingType;
  packHours: string;
  packTotalValue: string;
  hourlyRate: string;
  currency: string;
};

const billingTypeLabels: Record<BillingType, string> = {
  hourly: "Valor hora",
  pack: "Pack de horas"
};

const defaultFormState: FormState = {
  name: "",
  clientId: "",
  description: "",
  status: "active",
  visibility: "internal",
  billingType: "hourly",
  packHours: "",
  packTotalValue: "",
  hourlyRate: "",
  currency: "EUR"
};

export function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdProjectInfo, setCreatedProjectInfo] = useState<Project | null>(null);
  const [formValues, setFormValues] = useState<FormState>(defaultFormState);
  const [detailsProjectId, setDetailsProjectId] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data, isLoading } = useQuery<PaginatedResponse<Project>>({
    queryKey: ["projects", { search }],
    queryFn: () => fetchProjects()
  });

  const { data: clientsData, isLoading: isLoadingClients } = useQuery<PaginatedResponse<Client>>({
    queryKey: ["clients", "options"],
    queryFn: () => fetchClients()
  });

  const createProjectMutation = useMutation({
    mutationFn: async (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: (project) => {
      setErrorMessage(null);
      setCreatedProjectInfo(project);
      setFormValues(defaultFormState);
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: unknown) => {
      let message = "Não foi possível criar o projeto. Tenta novamente.";
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

  const projects = data?.results ?? [];
  const filtered = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  const clients = clientsData?.results ?? [];

  const selectedProject = useMemo(
    () =>
      detailsProjectId
        ? projects.find((project) => project.id === detailsProjectId) ?? null
        : null,
    [detailsProjectId, projects]
  );

  const {
    data: selectedProjectEntriesData,
    isLoading: isLoadingProjectEntries
  } = useQuery({
    queryKey: ["time-entries", { project: detailsProjectId }],
    queryFn: () =>
      fetchTimeEntries({
        project: detailsProjectId ?? undefined,
        page_size: 100
      }),
    enabled: isDetailsOpen && detailsProjectId !== null
  });

  const projectEntries = selectedProjectEntriesData?.results ?? [];
  const selectedProjectProgress = selectedProject ? getPackProgress(selectedProject) : null;

  const handleFieldChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormValues((previous) => ({
        ...previous,
        [field]: value
      }));
    };

  const handleBillingTypeChange = (value: BillingType) => {
    setFormValues((previous) => ({
      ...previous,
      billingType: value,
      // Clear pack fields when switching to hourly and vice-versa
      ...(value === "hourly"
        ? { packHours: "", packTotalValue: "" }
        : {}),
      hourlyRate: previous.hourlyRate
    }));
  };

  const resetModalState = () => {
    setErrorMessage(null);
    setCreatedProjectInfo(null);
    setFormValues(defaultFormState);
  };

  const handleOpenModal = () => {
    resetModalState();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetModalState();
  };

  const openProjectDetails = (projectId: number) => {
    setDetailsProjectId(projectId);
    setIsDetailsOpen(true);
  };

  const closeProjectDetails = () => {
    setIsDetailsOpen(false);
    setDetailsProjectId(null);
  };

  const ensurePositiveDecimal = (value: string) => {
    const normalized = value.replace(",", ".").trim();
    if (!normalized) {
      return null;
    }
    const numeric = Number(normalized);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return null;
    }
    return normalized;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = formValues.name.trim();
    if (!trimmedName) {
      setErrorMessage("O nome do projeto é obrigatório.");
      return;
    }
    if (!formValues.clientId) {
      setErrorMessage("Seleciona um cliente para associar ao projeto.");
      return;
    }
    const currency = formValues.currency.trim() || "EUR";

    const payload: CreateProjectPayload = {
      name: trimmedName,
      client: Number(formValues.clientId),
      status: formValues.status,
      visibility: formValues.visibility,
      billing_type: formValues.billingType,
      currency,
      hourly_rate: ""
    };

    if (formValues.description.trim()) {
      payload.description = formValues.description.trim();
    }

    if (formValues.billingType === "pack") {
      const packHours = ensurePositiveDecimal(formValues.packHours);
      if (!packHours) {
        setErrorMessage("Indica um número de horas para o pack (valor superior a zero).");
        return;
      }
      const packTotalValue = ensurePositiveDecimal(formValues.packTotalValue);
      if (!packTotalValue) {
        setErrorMessage("Indica o valor total do pack (valor superior a zero).");
        return;
      }
      const hourlyRate = ensurePositiveDecimal(formValues.hourlyRate);
      if (!hourlyRate) {
        setErrorMessage("Indica o valor/hora para horas extra (valor superior a zero).");
        return;
      }
      payload.pack_hours = packHours;
      payload.pack_total_value = packTotalValue;
      payload.hourly_rate = hourlyRate;
    } else {
      const hourlyRate = ensurePositiveDecimal(formValues.hourlyRate);
      if (!hourlyRate) {
        setErrorMessage("Indica o valor/hora acordado (valor superior a zero).");
        return;
      }
      payload.hourly_rate = hourlyRate;
    }

    createProjectMutation.mutate(payload);
  };

  const renderBillingDetails = (project: Project) => {
    if (project.billing_type === "pack" && project.pack_hours && project.pack_total_value) {
      return (
        <div className="text-sm text-primary/80">
          <p>
            Pack: {project.pack_hours}h por {project.currency} {project.pack_total_value}
          </p>
          {project.hourly_rate && (
            <p>
              Extra: {project.currency} {project.hourly_rate}/h
            </p>
          )}
        </div>
      );
    }

    if (project.hourly_rate) {
      return (
        <span className="text-sm text-primary/80">
          {project.currency} {project.hourly_rate}/h
        </span>
      );
    }

    return <span className="text-sm text-primary/60">—</span>;
  };

function getPackProgress(project: Project) {
  if (project.billing_type !== "pack" || !project.pack_hours) {
    return null;
  }
  const packHours = parseFloat(project.pack_hours);
  if (!Number.isFinite(packHours) || packHours <= 0) {
    return null;
  }
  const loggedHours = project.total_logged_minutes / 60;
  const percentageRaw = (loggedHours / packHours) * 100;
  const percentage = Math.min(100, Math.max(0, Math.round(percentageRaw)));
  return {
    packHours,
    loggedHours,
    percentage
  };
}

  const formatDateTime = (value: string | null) => {
    if (!value) {
      return "—";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleString();
  };

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Projetos</h1>
          <p className="text-sm text-primary/70">
            Controle visibilidade, estado e horas registadas por projeto.
          </p>
        </div>
        <Button type="button" onClick={handleOpenModal}>
          Criar projeto
        </Button>
      </div>
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <Input
            placeholder="Filtrar por nome..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          <span className="text-sm text-primary/70">
            {filtered.length} projetos listados
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Visibilidade</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Atualizado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7}>A carregar...</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              filtered.map((project: Project) => (
                <TableRow
                  key={project.id}
                  className="cursor-pointer transition-colors hover:bg-primary/5"
                  onClick={() => openProjectDetails(project.id)}
                >
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.client_name}</TableCell>
                  <TableCell>
                    <Badge variant={project.status === "active" ? "success" : "neutral"}>
                      {statusLabels[project.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.visibility === "client" ? "Cliente" : "Interno"}</TableCell>
                  <TableCell>{renderBillingDetails(project)}</TableCell>
                  <TableCell>
                    {(() => {
                      const progress = getPackProgress(project);
                      if (!progress) {
                        return "—";
                      }
                      return (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-primary/70">
                            <span>
                              {progress.loggedHours.toFixed(1)}h / {progress.packHours.toFixed(1)}h
                            </span>
                            <span>{progress.percentage}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-primary/15">
                            <div
                              className="h-2 rounded-full bg-primary transition-all"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>{(project.total_logged_minutes / 60).toFixed(1)}h</TableCell>
                  <TableCell>{new Date(project.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>Sem projetos para apresentar.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <Card className="w-full max-w-3xl p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text">Novo projeto</h2>
                <p className="text-sm text-primary/70">
                  Regista os detalhes iniciais, incluindo o modelo de faturação combinado.
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

            {createdProjectInfo ? (
              <div className="space-y-4 rounded-lg border border-success/40 bg-success/10 p-5">
                <div>
                  <p className="font-medium text-success">Projeto criado com sucesso.</p>
                  <p className="text-sm text-primary/80">
                    Partilha estas condições com a equipa e regista-as na primeira nota do projeto.
                  </p>
                </div>
                <div className="rounded-md bg-white p-4 shadow-sm">
                  <p className="text-base font-semibold text-text">{createdProjectInfo.name}</p>
                  <p className="text-sm text-primary/70">
                    Cliente: {createdProjectInfo.client_name}
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-primary/80">
                    {createdProjectInfo.billing_type === "pack" &&
                    createdProjectInfo.pack_hours &&
                    createdProjectInfo.pack_total_value ? (
                      <>
                        <p>
                          Pack: {createdProjectInfo.pack_hours}h por {createdProjectInfo.currency}{" "}
                          {createdProjectInfo.pack_total_value}
                        </p>
                        {createdProjectInfo.hourly_rate && (
                          <p>
                            Extra: {createdProjectInfo.currency} {createdProjectInfo.hourly_rate}/h
                          </p>
                        )}
                      </>
                    ) : (
                      <p>
                        Valor hora: {createdProjectInfo.currency} {createdProjectInfo.hourly_rate}/h
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={handleCloseModal}>
                    Concluir
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCreatedProjectInfo(null);
                    }}
                  >
                    Criar outro
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Nome</Label>
                    <Input
                      id="project-name"
                      value={formValues.name}
                      onChange={handleFieldChange("name")}
                      placeholder="Ex. Implementação ERP"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-client">Cliente</Label>
                    <select
                      id="project-client"
                      value={formValues.clientId}
                      onChange={handleFieldChange("clientId")}
                      className="h-10 w-full rounded-lg border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Seleciona um cliente</option>
                      {isLoadingClients && <option value="">A carregar clientes...</option>}
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Notas iniciais</Label>
                  <textarea
                    id="project-description"
                    value={formValues.description}
                    onChange={handleFieldChange("description")}
                    className="h-28 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Resumo do âmbito, objetivos e condições acordadas logo à partida."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="project-status">Estado</Label>
                    <select
                      id="project-status"
                      value={formValues.status}
                      onChange={handleFieldChange("status")}
                      className="h-10 w-full rounded-lg border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="active">Ativo</option>
                      <option value="paused">Pausado</option>
                      <option value="archived">Arquivado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-visibility">Visibilidade</Label>
                    <select
                      id="project-visibility"
                      value={formValues.visibility}
                      onChange={handleFieldChange("visibility")}
                      className="h-10 w-full rounded-lg border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="internal">Interno</option>
                      <option value="client">Cliente</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-currency">Moeda</Label>
                    <Input
                      id="project-currency"
                      value={formValues.currency}
                      onChange={handleFieldChange("currency")}
                      placeholder="EUR"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Modelo de faturação</Label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(billingTypeLabels) as BillingType[]).map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={formValues.billingType === type ? "default" : "outline"}
                        className={cn("px-4", formValues.billingType === type && "ring-2 ring-primary")}
                        onClick={() => handleBillingTypeChange(type)}
                      >
                        {billingTypeLabels[type]}
                      </Button>
                    ))}
                  </div>
                </div>

                {formValues.billingType === "pack" && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="project-pack-hours">Horas incluídas</Label>
                      <Input
                        id="project-pack-hours"
                        value={formValues.packHours}
                        onChange={handleFieldChange("packHours")}
                        placeholder="Ex. 40"
                        inputMode="decimal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-pack-total">Valor do pack</Label>
                      <Input
                        id="project-pack-total"
                        value={formValues.packTotalValue}
                        onChange={handleFieldChange("packTotalValue")}
                        placeholder="Ex. 3200"
                        inputMode="decimal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-hourly-rate">Valor hora extra</Label>
                      <Input
                        id="project-hourly-rate"
                        value={formValues.hourlyRate}
                        onChange={handleFieldChange("hourlyRate")}
                        placeholder="Ex. 85"
                        inputMode="decimal"
                      />
                    </div>
                  </div>
                )}

                {formValues.billingType === "hourly" && (
                  <div className="space-y-2 md:w-1/3">
                    <Label htmlFor="project-hourly-rate">Valor hora</Label>
                    <Input
                      id="project-hourly-rate"
                      value={formValues.hourlyRate}
                      onChange={handleFieldChange("hourlyRate")}
                      placeholder="Ex. 80"
                      inputMode="decimal"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCloseModal}
                    disabled={createProjectMutation.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createProjectMutation.isPending}>
                    {createProjectMutation.isPending ? "A criar..." : "Guardar projeto"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}

      {isDetailsOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <Card className="w-full max-w-4xl p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-text">{selectedProject.name}</h2>
                <p className="text-sm text-primary/70">
                  Vê um resumo do projeto e as entradas de tempo associadas.
                </p>
              </div>
              <Button type="button" variant="ghost" onClick={closeProjectDetails}>
                Fechar
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-lg border border-primary/15 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-primary/60">Cliente</p>
                <p className="text-base font-medium text-text">{selectedProject.client_name}</p>
              </div>
              <div className="space-y-2 rounded-lg border border-primary/15 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-primary/60">Estado</p>
                <p className="text-base font-medium text-text">{statusLabels[selectedProject.status]}</p>
              </div>
              <div className="space-y-2 rounded-lg border border-primary/15 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-primary/60">Visibilidade</p>
                <p className="text-base font-medium text-text">
                  {selectedProject.visibility === "client" ? "Cliente" : "Interno"}
                </p>
              </div>
              <div className="space-y-2 rounded-lg border border-primary/15 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-primary/60">Modelo de faturação</p>
                <div>{renderBillingDetails(selectedProject)}</div>
              </div>
              <div className="space-y-2 rounded-lg border border-primary/15 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-primary/60">Criado em</p>
                <p className="text-base font-medium text-text">{formatDateTime(selectedProject.created_at)}</p>
              </div>
              <div className="space-y-2 rounded-lg border border-primary/15 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-primary/60">Última atualização</p>
                <p className="text-base font-medium text-text">{formatDateTime(selectedProject.updated_at)}</p>
              </div>
            </div>

            {selectedProject.description && (
              <div className="mt-4 rounded-lg border border-primary/15 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-primary/60">Notas iniciais</p>
                <p className="mt-1 text-sm text-primary/90">{selectedProject.description}</p>
              </div>
            )}

            {selectedProjectProgress && (
              <div className="mt-4 rounded-lg border border-primary/15 bg-white px-4 py-4">
                <div className="mb-2 flex items-center justify-between text-sm text-primary/70">
                  <span>
                    Pack consumido: {selectedProjectProgress.loggedHours.toFixed(1)}h /{" "}
                    {selectedProjectProgress.packHours.toFixed(1)}h
                  </span>
                  <span>{selectedProjectProgress.percentage}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-primary/15">
                  <div
                    className="h-3 rounded-full bg-primary transition-all"
                    style={{ width: `${selectedProjectProgress.percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-primary/70">
                  Mantém o cliente informado quando o pack estiver perto do limite.
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-text">Entradas de tempo</h3>
                  <p className="text-sm text-primary/70">Detalhe do trabalho registado neste projeto.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() =>
                    void queryClient.invalidateQueries({ queryKey: ["time-entries", { project: detailsProjectId }] })
                  }
                >
                  Atualizar
                </Button>
              </div>
              <div className="rounded-lg border border-primary/10 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Utilizador</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Billable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingProjectEntries && (
                      <TableRow>
                        <TableCell colSpan={6}>A carregar...</TableCell>
                      </TableRow>
                    )}
                    {!isLoadingProjectEntries && projectEntries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>Ainda não existem registos de tempo.</TableCell>
                      </TableRow>
                    )}
                    {!isLoadingProjectEntries &&
                      projectEntries.map((entry: TimeEntry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{formatDate(entry.date)}</TableCell>
                          <TableCell>{entry.user_email}</TableCell>
                          <TableCell>{entry.task || "—"}</TableCell>
                          <TableCell>{(entry.duration_minutes / 60).toFixed(2)}h</TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-primary/80" title={entry.notes || undefined}>
                            {entry.notes || "—"}
                          </TableCell>
                          <TableCell>{entry.billable ? "Sim" : "Não"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
