import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchSystemSettings, updateSystemSettings } from "@/lib/queries";
import type { UpdateSystemSettingsPayload } from "@/lib/queries";
import type { SystemSettings } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/utils";

type FormState = {
  company_name: string;
  company_legal_name: string;
  company_email: string;
  company_phone: string;
  company_website: string;
  company_vat: string;
  company_address: string;
  support_email: string;
  billing_email: string;
  default_sender_name: string;
  default_sender_email: string;
  reply_to_email: string;
  smtp_host: string;
  smtp_port: string;
  smtp_username: string;
  smtp_use_tls: boolean;
  smtp_use_ssl: boolean;
};

const defaultFormState: FormState = {
  company_name: "",
  company_legal_name: "",
  company_email: "",
  company_phone: "",
  company_website: "",
  company_vat: "",
  company_address: "",
  support_email: "",
  billing_email: "",
  default_sender_name: "",
  default_sender_email: "",
  reply_to_email: "",
  smtp_host: "",
  smtp_port: "587",
  smtp_username: "",
  smtp_use_tls: true,
  smtp_use_ssl: false
};

const formatDateTime = (value: string) => {
  if (!value) {
    return "—";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
};

const parseErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (error.response?.data && typeof error.response.data === "object") {
      const values = Object.values(error.response.data);
      if (values.length > 0 && typeof values[0] === "string") {
        return values[0];
      }
    }
  }
  return fallback;
};

export function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<FormState>(defaultFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [smtpPasswordInput, setSmtpPasswordInput] = useState("");
  const [smtpPasswordChanged, setSmtpPasswordChanged] = useState(false);
  const [smtpPasswordSet, setSmtpPasswordSet] = useState(false);
  const [brandingLogoFile, setBrandingLogoFile] = useState<File | null>(null);
  const [brandingLogoPreview, setBrandingLogoPreview] = useState<string | null>(null);
  const [removeBrandingLogo, setRemoveBrandingLogo] = useState(false);

  const { data, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["system-settings"],
    queryFn: () => fetchSystemSettings()
  });

  const lastUpdatedAt = useMemo(() => (data ? formatDateTime(data.updated_at) : null), [data]);
  const lastUpdatedLabel = useMemo(
    () => (lastUpdatedAt ? t("admin.settings.lastUpdated", { datetime: lastUpdatedAt }) : null),
    [lastUpdatedAt, t]
  );
  const hasPersistedLogo = Boolean(data?.branding_logo_url);

  useEffect(
    () => () => {
      if (brandingLogoPreview && brandingLogoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(brandingLogoPreview);
      }
    },
    [brandingLogoPreview]
  );

  useEffect(() => {
    if (data) {
      const {
        smtp_port,
        smtp_password_set,
        branding_logo: _branding_logo,
        branding_logo_url,
        created_at: _created,
        updated_at: _updated,
        ...rest
      } = data;
      setFormValues({
        ...rest,
        smtp_port: String(smtp_port ?? 587)
      });
      setSmtpPasswordSet(Boolean(smtp_password_set));
      setSmtpPasswordInput("");
      setSmtpPasswordChanged(false);
      setSuccessMessage(null);
      setFormError(null);
       if (brandingLogoPreview && brandingLogoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(brandingLogoPreview);
      }
      const resolvedLogoUrl = resolveMediaUrl(branding_logo_url);
      setBrandingLogoFile(null);
      setBrandingLogoPreview(resolvedLogoUrl);
      setRemoveBrandingLogo(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const updateSettingsMutation = useMutation({
    mutationFn: (payload: UpdateSystemSettingsPayload) => updateSystemSettings(payload),
    onSuccess: (response: SystemSettings) => {
      void queryClient.setQueryData(["system-settings"], response);
      setSuccessMessage(t("admin.settings.feedback.success"));
      setFormError(null);
      setSmtpPasswordSet(Boolean(response.smtp_password_set));
      setSmtpPasswordInput("");
      setSmtpPasswordChanged(false);
      setBrandingLogoFile(null);
      setRemoveBrandingLogo(false);
    },
    onError: (error: unknown) => {
      setSuccessMessage(null);
      setFormError(parseErrorMessage(error, t("admin.settings.feedback.error")));
    }
  });

  const isSaving = updateSettingsMutation.isPending;

  const handleInputChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormValues((previous) => ({
        ...previous,
        [field]: value
      }));
    };

  const handleCheckboxChange =
    (field: "smtp_use_tls" | "smtp_use_ssl") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setFormValues((previous) => {
        if (field === "smtp_use_tls" && checked) {
          return { ...previous, smtp_use_tls: true, smtp_use_ssl: false };
        }
        if (field === "smtp_use_ssl" && checked) {
          return { ...previous, smtp_use_ssl: true, smtp_use_tls: false };
        }
        return { ...previous, [field]: checked };
      });
    };

  const handleSmtpPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSmtpPasswordInput(event.target.value);
    setSmtpPasswordChanged(true);
    setSuccessMessage(null);
  };

  const handleBrandingLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSuccessMessage(null);
    if (brandingLogoPreview && brandingLogoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(brandingLogoPreview);
    }
    setBrandingLogoFile(file);
    if (file) {
      setBrandingLogoPreview(URL.createObjectURL(file));
      setRemoveBrandingLogo(false);
    } else {
      setBrandingLogoPreview(resolveMediaUrl(data?.branding_logo_url ?? null));
      setRemoveBrandingLogo(false);
    }
  };

  const handleRemoveBrandingLogo = () => {
    setSuccessMessage(null);
    if (removeBrandingLogo && hasPersistedLogo && !brandingLogoFile) {
      setBrandingLogoPreview(resolveMediaUrl(data?.branding_logo_url ?? null));
      setRemoveBrandingLogo(false);
      return;
    }
    if (brandingLogoPreview && brandingLogoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(brandingLogoPreview);
    }
    setBrandingLogoFile(null);
    setBrandingLogoPreview(null);
    setRemoveBrandingLogo(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);

    const parsedPort = Number.parseInt(formValues.smtp_port, 10);
    if (Number.isNaN(parsedPort) || parsedPort <= 0) {
      setFormError(t("admin.settings.validations.port"));
      return;
    }

    const payload: UpdateSystemSettingsPayload = {
      company_name: formValues.company_name.trim(),
      company_legal_name: formValues.company_legal_name.trim(),
      company_email: formValues.company_email.trim(),
      company_phone: formValues.company_phone.trim(),
      company_website: formValues.company_website.trim(),
      company_vat: formValues.company_vat.trim(),
      company_address: formValues.company_address.trim(),
      support_email: formValues.support_email.trim(),
      billing_email: formValues.billing_email.trim(),
      default_sender_name: formValues.default_sender_name.trim(),
      default_sender_email: formValues.default_sender_email.trim(),
      reply_to_email: formValues.reply_to_email.trim(),
      smtp_host: formValues.smtp_host.trim(),
      smtp_port: parsedPort,
      smtp_username: formValues.smtp_username.trim(),
      smtp_use_tls: formValues.smtp_use_tls,
      smtp_use_ssl: formValues.smtp_use_ssl
    };

    if (smtpPasswordChanged) {
      payload.smtp_password = smtpPasswordInput;
    }

    if (brandingLogoFile) {
      payload.branding_logo = brandingLogoFile;
    }

    if (removeBrandingLogo && !brandingLogoFile) {
      payload.remove_branding_logo = true;
    }

    updateSettingsMutation.mutate(payload);
  };

  const hasBrandingLogo = Boolean(brandingLogoPreview);
  const smtpPasswordHint = smtpPasswordSet
    ? t("admin.settings.smtp.passwordHintExisting")
    : t("admin.settings.smtp.passwordHintNew");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">{t("admin.settings.title")}</h1>
        <p className="text-sm text-primary/70">{t("admin.settings.subtitle")}</p>
        {lastUpdatedLabel && (
          <p className="mt-1 text-xs text-primary/60">{lastUpdatedLabel}</p>
        )}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {(formError || successMessage) && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              formError
                ? "border-danger/40 bg-danger/10 text-danger"
                : "border-success/40 bg-success/10 text-success"
            }`}
          >
            {formError ?? successMessage}
          </div>
        )}

        <Card className="space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-text">{t("admin.settings.company.title")}</h2>
            <p className="text-sm text-primary/70">{t("admin.settings.company.description")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">{t("admin.settings.company.fields.name.label")}</Label>
              <Input
                id="company-name"
                value={formValues.company_name}
                onChange={handleInputChange("company_name")}
                placeholder={t("admin.settings.company.fields.name.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-legal-name">{t("admin.settings.company.fields.legalName.label")}</Label>
              <Input
                id="company-legal-name"
                value={formValues.company_legal_name}
                onChange={handleInputChange("company_legal_name")}
                placeholder={t("admin.settings.company.fields.legalName.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-email">{t("admin.settings.company.fields.email.label")}</Label>
              <Input
                id="company-email"
                type="email"
                value={formValues.company_email}
                onChange={handleInputChange("company_email")}
                placeholder={t("admin.settings.company.fields.email.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">{t("admin.settings.company.fields.phone.label")}</Label>
              <Input
                id="company-phone"
                value={formValues.company_phone}
                onChange={handleInputChange("company_phone")}
                placeholder={t("admin.settings.company.fields.phone.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-website">{t("admin.settings.company.fields.website.label")}</Label>
              <Input
                id="company-website"
                type="url"
                value={formValues.company_website}
                onChange={handleInputChange("company_website")}
                placeholder={t("admin.settings.company.fields.website.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-vat">{t("admin.settings.company.fields.vat.label")}</Label>
              <Input
                id="company-vat"
                value={formValues.company_vat}
                onChange={handleInputChange("company_vat")}
                placeholder={t("admin.settings.company.fields.vat.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-address">{t("admin.settings.company.fields.address.label")}</Label>
            <textarea
              id="company-address"
              className="h-24 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
              value={formValues.company_address}
              onChange={handleInputChange("company_address")}
              placeholder={t("admin.settings.company.fields.address.placeholder")}
              disabled={isLoadingSettings || isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branding-logo">{t("admin.settings.company.fields.logo.label")}</Label>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-primary/20 bg-white">
                {hasBrandingLogo ? (
                  <img
                    src={brandingLogoPreview ?? ""}
                    alt={t("admin.settings.company.fields.logo.alt")}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-primary/50">{t("admin.settings.company.fields.logo.empty")}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  id="branding-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleBrandingLogoChange}
                  disabled={isLoadingSettings || isSaving}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveBrandingLogo}
                    disabled={(!hasBrandingLogo && !brandingLogoFile && !hasPersistedLogo) || isLoadingSettings || isSaving}
                  >
                    {removeBrandingLogo && !brandingLogoFile
                      ? t("admin.settings.company.fields.logo.undoRemove")
                      : t("admin.settings.company.fields.logo.remove")}
                  </Button>
                  <span className="text-xs text-primary/60">
                    {t("admin.settings.company.fields.logo.guidelines")}
                  </span>
                </div>
                {removeBrandingLogo && !brandingLogoFile && (
                  <span className="text-xs text-danger">
                    {t("admin.settings.company.fields.logo.removeWarning")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-text">{t("admin.settings.emails.title")}</h2>
            <p className="text-sm text-primary/70">{t("admin.settings.emails.description")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="support-email">{t("admin.settings.emails.fields.supportEmail.label")}</Label>
              <Input
                id="support-email"
                type="email"
                value={formValues.support_email}
                onChange={handleInputChange("support_email")}
                placeholder={t("admin.settings.emails.fields.supportEmail.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-email">{t("admin.settings.emails.fields.billingEmail.label")}</Label>
              <Input
                id="billing-email"
                type="email"
                value={formValues.billing_email}
                onChange={handleInputChange("billing_email")}
                placeholder={t("admin.settings.emails.fields.billingEmail.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="default-sender-name">{t("admin.settings.emails.fields.defaultSenderName.label")}</Label>
              <Input
                id="default-sender-name"
                value={formValues.default_sender_name}
                onChange={handleInputChange("default_sender_name")}
                placeholder={t("admin.settings.emails.fields.defaultSenderName.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-sender-email">{t("admin.settings.emails.fields.defaultSenderEmail.label")}</Label>
              <Input
                id="default-sender-email"
                type="email"
                value={formValues.default_sender_email}
                onChange={handleInputChange("default_sender_email")}
                placeholder={t("admin.settings.emails.fields.defaultSenderEmail.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
          </div>

          <div className="space-y-2 md:w-1/2">
            <Label htmlFor="reply-to-email">{t("admin.settings.emails.fields.replyToEmail.label")}</Label>
            <Input
              id="reply-to-email"
              type="email"
              value={formValues.reply_to_email}
              onChange={handleInputChange("reply_to_email")}
              placeholder={t("admin.settings.emails.fields.replyToEmail.placeholder")}
              disabled={isLoadingSettings || isSaving}
            />
          </div>
        </Card>

        <Card className="space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-text">{t("admin.settings.smtp.title")}</h2>
            <p className="text-sm text-primary/70">{t("admin.settings.smtp.description")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">{t("admin.settings.smtp.fields.host.label")}</Label>
              <Input
                id="smtp-host"
                value={formValues.smtp_host}
                onChange={handleInputChange("smtp_host")}
                placeholder={t("admin.settings.smtp.fields.host.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">{t("admin.settings.smtp.fields.port.label")}</Label>
              <Input
                id="smtp-port"
                value={formValues.smtp_port}
                onChange={handleInputChange("smtp_port")}
                placeholder={t("admin.settings.smtp.fields.port.placeholder")}
                disabled={isLoadingSettings || isSaving}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-username">{t("admin.settings.smtp.fields.username.label")}</Label>
              <Input
                id="smtp-username"
                value={formValues.smtp_username}
                onChange={handleInputChange("smtp_username")}
                placeholder={t("admin.settings.smtp.fields.username.placeholder")}
                disabled={isLoadingSettings || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">{t("admin.settings.smtp.fields.password.label")}</Label>
              <Input
                id="smtp-password"
                type="password"
                value={smtpPasswordInput}
                onChange={handleSmtpPasswordChange}
                placeholder={smtpPasswordSet ? "••••••••" : ""}
                disabled={isLoadingSettings || isSaving}
              />
              <p className="text-xs text-primary/60">{smtpPasswordHint}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={formValues.smtp_use_tls}
                onChange={handleCheckboxChange("smtp_use_tls")}
                disabled={isLoadingSettings || isSaving}
              />
              {t("admin.settings.smtp.toggles.tls")}
            </label>
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={formValues.smtp_use_ssl}
                onChange={handleCheckboxChange("smtp_use_ssl")}
                disabled={isLoadingSettings || isSaving}
              />
              {t("admin.settings.smtp.toggles.ssl")}
            </label>
          </div>

          <p className="text-xs text-primary/60">{t("admin.settings.smtp.guidance")}</p>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            disabled={isSaving || isLoadingSettings}
          >
            {isSaving ? t("admin.settings.form.submitting") : t("admin.settings.form.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
