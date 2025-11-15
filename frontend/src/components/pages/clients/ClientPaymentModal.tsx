import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientPayment } from "@/lib/queries";
import type { CreateClientPaymentPayload } from "@/lib/queries";

import {
  createEmptyPaymentForm,
  type PaymentFormState
} from "./utils";

type ClientPaymentModalProps = {
  clientId: number | null;
  isOpen: boolean;
  currency: string;
  onClose: () => void;
};

export function ClientPaymentModal({ clientId, isOpen, currency, onClose }: ClientPaymentModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(createEmptyPaymentForm());
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentForm(createEmptyPaymentForm());
      setPaymentError(null);
      setPaymentSuccessMessage(null);
    }
  }, [isOpen, clientId]);

  const createPaymentMutation = useMutation({
    mutationFn: async (payload: CreateClientPaymentPayload) => {
      if (clientId === null) {
        throw new Error("Missing client id.");
      }
      return createClientPayment(clientId, payload);
    },
    onSuccess: () => {
      setPaymentError(null);
      setPaymentSuccessMessage(t("admin.clients.details.account.paymentForm.success"));
      setPaymentForm(createEmptyPaymentForm());
      if (clientId !== null) {
        void queryClient.invalidateQueries({ queryKey: ["client-account", clientId] });
      }
    },
    onError: (error: unknown) => {
      let message = t("admin.clients.details.account.errors.paymentFallback");
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
      setPaymentError(message);
      setPaymentSuccessMessage(null);
    }
  });

  const handlePaymentInputChange =
    (field: keyof PaymentFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPaymentForm((previous) => ({
        ...previous,
        [field]: event.target.value
      }));
      if (paymentError) {
        setPaymentError(null);
      }
      if (paymentSuccessMessage) {
        setPaymentSuccessMessage(null);
      }
    };

  const handleSubmitPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clientId) {
      return;
    }
    const trimmedAmount = paymentForm.amount.trim();
    if (!trimmedAmount) {
      setPaymentError(t("admin.clients.details.account.paymentForm.amountRequired"));
      setPaymentSuccessMessage(null);
      return;
    }

    const payload: CreateClientPaymentPayload = {
      amount: trimmedAmount,
      currency,
      occurred_at: paymentForm.occurredAt,
      ...(paymentForm.paymentMethod.trim()
        ? { payment_method: paymentForm.paymentMethod.trim() }
        : {}),
      ...(paymentForm.reference.trim() ? { reference: paymentForm.reference.trim() } : {}),
      ...(paymentForm.description.trim()
        ? { description: paymentForm.description.trim() }
        : {}),
      ...(paymentForm.notes.trim() ? { notes: paymentForm.notes.trim() } : {})
    };

    createPaymentMutation.mutate(payload);
  };

  if (!isOpen || clientId === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <Card className="w-full max-w-xl p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-text">
              {t("admin.clients.details.account.paymentForm.title")}
            </h3>
            <p className="text-sm text-primary/70">
              {t("admin.clients.details.account.paymentForm.subtitle")}
            </p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.actions.close")}
          </Button>
        </div>

        {paymentError && (
          <div className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {paymentError}
          </div>
        )}

        {paymentSuccessMessage && (
          <div className="mt-4 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
            {paymentSuccessMessage}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmitPayment}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">
                {t("admin.clients.details.account.paymentForm.amountLabel")}
              </Label>
              <Input
                id="payment-amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={paymentForm.amount}
                onChange={handlePaymentInputChange("amount")}
                placeholder={t("admin.clients.details.account.paymentForm.amountPlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date">
                {t("admin.clients.details.account.paymentForm.dateLabel")}
              </Label>
              <Input
                id="payment-date"
                type="date"
                value={paymentForm.occurredAt}
                onChange={handlePaymentInputChange("occurredAt")}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment-method">
                {t("admin.clients.details.account.paymentForm.methodLabel")}
              </Label>
              <Input
                id="payment-method"
                value={paymentForm.paymentMethod}
                onChange={handlePaymentInputChange("paymentMethod")}
                placeholder={t("admin.clients.details.account.paymentForm.methodPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-reference">
                {t("admin.clients.details.account.paymentForm.referenceLabel")}
              </Label>
              <Input
                id="payment-reference"
                value={paymentForm.reference}
                onChange={handlePaymentInputChange("reference")}
                placeholder={t("admin.clients.details.account.paymentForm.referencePlaceholder")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-description">
              {t("admin.clients.details.account.paymentForm.descriptionLabel")}
            </Label>
            <Input
              id="payment-description"
              value={paymentForm.description}
              onChange={handlePaymentInputChange("description")}
              placeholder={t("admin.clients.details.account.paymentForm.descriptionPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-notes">
              {t("admin.clients.details.account.paymentForm.notesLabel")}
            </Label>
            <textarea
              id="payment-notes"
              value={paymentForm.notes}
              onChange={handlePaymentInputChange("notes")}
              className="h-24 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t("admin.clients.details.account.paymentForm.notesPlaceholder")}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t("common.actions.cancel")}
            </Button>
            <Button type="submit" disabled={createPaymentMutation.isPending}>
              {createPaymentMutation.isPending
                ? t("admin.clients.details.account.paymentForm.submitting")
                : t("admin.clients.details.account.paymentForm.submit")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

