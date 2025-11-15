import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createClient
} from "@/lib/queries";
import type {
  CreateClientPayload,
  CreateClientResponse
} from "@/lib/queries";

type CreateClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormState = {
  name: string;
  email: string;
  vat: string;
  notes: string;
  brandingLogo: File | null;
};

const createInitialFormState = (): FormState => ({
  name: "",
  email: "",
  vat: "",
  notes: "",
  brandingLogo: null
});

export function CreateClientModal({ isOpen, onClose }: CreateClientModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formValues, setFormValues] = useState<FormState>(createInitialFormState());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdClientInfo, setCreatedClientInfo] = useState<CreateClientResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormValues(createInitialFormState());
      setErrorMessage(null);
      setCreatedClientInfo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const createClientMutation = useMutation({
    mutationFn: async (payload: CreateClientPayload) => createClient(payload),
    onSuccess: (client) => {
      setErrorMessage(null);
      setCreatedClientInfo(client);
      setFormValues(createInitialFormState());
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: unknown) => {
      let message = t("admin.clients.errors.createFallback");
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = formValues.name.trim();
    const trimmedEmail = formValues.email.trim();
    if (!trimmedName || !trimmedEmail) {
      setErrorMessage(t("admin.clients.errors.requiredFields"));
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

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <Card className="w-full max-w-xl p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text">{t("admin.clients.modal.title")}</h2>
            <p className="text-sm text-primary/70">{t("admin.clients.modal.description")}</p>
          </div>
          <Button type="button" variant="ghost" onClick={handleClose}>
            {t("common.actions.close")}
          </Button>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {errorMessage}
          </div>
        )}

        {createdClientInfo?.initial_password ? (
          <div className="mb-6 rounded-lg border border-success/40 bg-success/10 px-4 py-4">
            <p className="font-medium text-success">{t("admin.clients.success.title")}</p>
            <p className="mt-2 text-sm text-primary/80">
              {t("admin.clients.success.passwordLabel")}
              <span className="font-semibold"> {createdClientInfo.email}</span>:
            </p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <code className="rounded-md bg-white px-3 py-2 font-mono text-sm text-text shadow-sm">
                {createdClientInfo.initial_password}
              </code>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCopyPassword}>
                  {t("admin.clients.success.copyPassword")}
                </Button>
                <Button type="button" size="sm" onClick={handleClose}>
                  {t("admin.clients.success.complete")}
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-primary/70">
              {t("admin.clients.success.passwordReminder")}
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client-name">{t("admin.clients.form.nameLabel")}</Label>
                <Input
                  id="client-name"
                  value={formValues.name}
                  onChange={handleInputChange("name")}
                  placeholder={t("admin.clients.form.namePlaceholder")}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">{t("admin.clients.form.emailLabel")}</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={formValues.email}
                  onChange={handleInputChange("email")}
                  placeholder={t("admin.clients.form.emailPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client-vat">{t("admin.clients.form.vatLabel")}</Label>
                <Input
                  id="client-vat"
                  value={formValues.vat}
                  onChange={handleInputChange("vat")}
                  placeholder={t("admin.clients.form.vatPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-notes">{t("admin.clients.form.notesLabel")}</Label>
                <textarea
                  id="client-notes"
                  value={formValues.notes}
                  onChange={handleInputChange("notes")}
                  className="h-24 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t("admin.clients.form.notesPlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-logo">{t("admin.clients.form.logoLabel")}</Label>
              <Input
                id="client-logo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {formValues.brandingLogo && (
                <div className="flex items-center gap-2 text-xs text-primary/70">
                  <span>
                    {t("admin.clients.form.fileSelected", {
                      filename: formValues.brandingLogo.name
                    })}
                  </span>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                    {t("common.actions.remove")}
                  </Button>
                </div>
              )}
              <p className="text-xs text-primary/60">
                {t("admin.clients.form.fileHelp")}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={createClientMutation.isPending}
              >
                {t("common.actions.cancel")}
              </Button>
              <Button type="submit" disabled={createClientMutation.isPending}>
                {createClientMutation.isPending
                  ? t("admin.clients.actions.creating")
                  : t("admin.clients.actions.save")}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

