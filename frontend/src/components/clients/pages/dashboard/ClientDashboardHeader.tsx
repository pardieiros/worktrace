import { useTranslation } from "react-i18next";

export function ClientDashboardHeader() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text">{t("client.dashboard.title")}</h1>
      <p className="text-sm text-primary/70">{t("client.dashboard.subtitle")}</p>
    </div>
  );
}


