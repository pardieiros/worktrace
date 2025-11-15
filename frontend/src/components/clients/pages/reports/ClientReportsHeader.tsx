import { useTranslation } from "react-i18next";

export function ClientReportsHeader() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text">{t("client.reports.title")}</h1>
      <p className="text-sm text-primary/70">{t("client.reports.subtitle")}</p>
    </div>
  );
}


