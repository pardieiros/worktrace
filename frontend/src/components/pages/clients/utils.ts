export type PaymentFormState = {
  amount: string;
  occurredAt: string;
  paymentMethod: string;
  reference: string;
  description: string;
  notes: string;
};

const getTodayIso = () => new Date().toISOString().split("T")[0] ?? "";

export const createEmptyPaymentForm = (): PaymentFormState => ({
  amount: "",
  occurredAt: getTodayIso(),
  paymentMethod: "",
  reference: "",
  description: "",
  notes: ""
});

export const formatCurrency = (value: string | number, currency: string) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numeric);
  } catch {
    return `${numeric.toFixed(2)} ${currency}`;
  }
};

export const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
};

