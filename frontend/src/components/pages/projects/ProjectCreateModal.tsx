import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createProject,
  fetchClients
} from "@/lib/queries";
import type {
  CreateProjectPayload
} from "@/lib/queries";
import type { Client, PaginatedResponse, ProjectStatus, ProjectVisibility } from "@/lib/types";

type ProjectCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ProjectFormState = {
  name: string;
  clientId: string;
  description: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  billingType: "hourly" | "pack";
  currency: string;
  hourlyRate: string;
  packHours: string;
  packValue: string;
};

const defaultForm: ProjectFormState = {
  name: "",
  clientId: "",
  description: "",
  status: "active",
  visibility: "client",
  billingType: "hourly",
  currency: "EUR",
  hourlyRate: "",
  packHours: "",
  packValue: ""
};

const statusOptions: Array<{ value: ProjectStatus; translationKey: string }> = [
  { value: "active", translationKey: "admin.projects.status.active" },
  { value: "paused", translationKey: "admin.projects.status.paused" },
  { value: "archived", translationKey: "admin.projects.status.archived" }
];

const visibilityOptions: Array<{ value: ProjectVisibility; translationKey: string }> = [
  { value: "client", translationKey: "admin.projects.visibility.client" },
  { value: "internal", translationKey: "admin.projects.visibility.internal" }
];

export function ProjectCreateModal({ isOpen, onClose }: ProjectCreateModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [formState, setFormState] = useState<ProjectFormState>(defaultForm);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    data: clientsResponse,
    isLoading: isLoadingClients
  } = useQuery<PaginatedResponse<Client>>({
    queryKey: ["clients", "project-form"],
    queryFn: () => fetchClients(),
    enabled: isOpen
  });

  useEffect(() => {
    if (!isOpen) {
      setFormState(defaultForm);
      setFormError(null);
    }
  }, [isOpen]);

  const createProjectMutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      setFormError(null);
      setFormState(defaultForm);
      onClose();
      void queryClient.invalidateQueries({ queryKey: ["projects", "admin"] });
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string") {
          setFormError(detail);
          return;
        }
        const firstValue =
          error.response?.data && Object.values(error.response.data)[0];
        if (typeof firstValue === "string") {
          setFormError(firstValue);
          return;
        }
      }
      setFormError(t("admin.projects.errors.createFallback"));
    }
  });

  const clients = clientsResponse?.results ?? [];

  const updateForm =
    (field: keyof ProjectFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value =
        field === "billingType" || field === "status" || field === "visibility"
          ? (event.target.value as ProjectFormState[typeof field])
          : event.target.value;
      setFormState((previous) => ({
        ...previous,
        [field]: value as never
      }));
    };

  const validateForm = (): string | null => {
    if (!formState.name.trim()) {
      return t("admin.projects.validations.nameRequired");
    }
    if (!formState.clientId) {
      return t("admin.projects.validations.clientRequired");
    }
    if (formState.billingType === "hourly" && !formState.hourlyRate.trim()) {
      return t("admin.projects.validations.hourlyRate");
    }
    if (formState.billingType === "pack") {
      if (!formState.packHours.trim() || !formState.packValue.trim()) {
        return t("admin.projects.validations.packDetails");
      }
    }
    return null;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload: CreateProjectPayload = {
      name: formState.name.trim(),
      client: Number(formState.clientId),
      status: formState.status,
      visibility: formState.visibility,
      billing_type: formState.billingType,
      currency: formState.currency,
      description: formState.description.trim() || undefined,
      hourly_rate: formState.billingType === "hourly" ? formState.hourlyRate : "",
      pack_hours: formState.billingType === "pack" ? formState.packHours : undefined,
      pack_total_value: formState.billingType === "pack" ? formState.packValue : undefined
    };

    createProjectMutation.mutate(payload);
  };

  const isDisabled = createProjectMutation.isPending;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <Card className="w-full max-w-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text">{t("admin.projects.modal.title")}</h2>
            <p className="text-sm text-primary/70">{t("admin.projects.modal.description")}</p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isDisabled}>
            {t("common.actions.close")}
          </Button>
        </div>

        {formError && (
          <div className="mb-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {formError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text" htmlFor="project-name">
                {t("admin.projects.modal.fields.name")}
              </label>
              <Input
                id="project-name"
                value={formState.name}
                onChange={updateForm("name")}
                placeholder={t("admin.projects.modal.placeholders.name")}
                disabled={isDisabled}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text" htmlFor="project-client">
                {t("admin.projects.modal.fields.client")}
              </label>
              <select
                id="project-client"
                value={formState.clientId}
                onChange={updateForm("clientId")}
                className="h-10 w-full rounded-md border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoadingClients || isDisabled}
              >
                <option value="">{t("admin.projects.modal.placeholders.client")}</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text" htmlFor="project-description">
              {t("admin.projects.modal.fields.description")}
            </label>
            <textarea
              id="project-description"
              value={formState.description}
              onChange={updateForm("description")}
              className="h-28 w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t("admin.projects.modal.placeholders.description")}
              disabled={isDisabled}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text" htmlFor="project-status">
                {t("admin.projects.modal.fields.status")}
              </label>
              <select
                id="project-status"
                value={formState.status}
                onChange={updateForm("status")}
                className="h-10 w-full rounded-md border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isDisabled}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.translationKey)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text" htmlFor="project-visibility">
                {t("admin.projects.modal.fields.visibility")}
              </label>
              <select
                id="project-visibility"
                value={formState.visibility}
                onChange={updateForm("visibility")}
                className="h-10 w-full rounded-md border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isDisabled}
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.translationKey)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text" htmlFor="project-billing-type">
                {t("admin.projects.modal.fields.billingType")}
              </label>
              <select
                id="project-billing-type"
                value={formState.billingType}
                onChange={updateForm("billingType")}
                className="h-10 w-full rounded-md border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isDisabled}
              >
                <option value="hourly">{t("admin.projects.billing.hourly")}</option>
                <option value="pack">{t("admin.projects.billing.pack")}</option>
              </select>
            </div>
          </div>

          {formState.billingType === "hourly" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="project-hourly-rate">
                  {t("admin.projects.modal.fields.hourlyRate")}
                </label>
                <Input
                  id="project-hourly-rate"
                  value={formState.hourlyRate}
                  onChange={updateForm("hourlyRate")}
                  placeholder={t("admin.projects.modal.placeholders.hourlyRate")}
                  disabled={isDisabled}
                />
                <p className="text-xs text-primary/60">
                  {t("admin.projects.modal.helpers.hourlyRate")}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="project-currency">
                  {t("admin.projects.modal.fields.currency")}
                </label>
                <Input
                  id="project-currency"
                  value={formState.currency}
                  onChange={updateForm("currency")}
                  placeholder="EUR"
                  disabled={isDisabled}
                />
              </div>
            </div>
          )}

          {formState.billingType === "pack" && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="project-pack-hours">
                  {t("admin.projects.modal.fields.packHours")}
                </label>
                <Input
                  id="project-pack-hours"
                  value={formState.packHours}
                  onChange={updateForm("packHours")}
                  placeholder={t("admin.projects.modal.placeholders.packHours")}
                  disabled={isDisabled}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="project-pack-value">
                  {t("admin.projects.modal.fields.packValue")}
                </label>
                <Input
                  id="project-pack-value"
                  value={formState.packValue}
                  onChange={updateForm("packValue")}
                  placeholder={t("admin.projects.modal.placeholders.packValue")}
                  disabled={isDisabled}
                />
                <p className="text-xs text-primary/60">{t("admin.projects.modal.helpers.pack")}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="project-currency-pack">
                  {t("admin.projects.modal.fields.currency")}
                </label>
                <Input
                  id="project-currency-pack"
                  value={formState.currency}
                  onChange={updateForm("currency")}
                  placeholder="EUR"
                  disabled={isDisabled}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isDisabled}>
              {t("common.actions.cancel")}
            </Button>
            <Button type="submit" disabled={isDisabled}>
              {isDisabled
                ? t("admin.projects.actions.creating")
                : t("admin.projects.actions.create")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

