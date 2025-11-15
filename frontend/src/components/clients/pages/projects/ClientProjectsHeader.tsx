import { useTranslation } from "react-i18next";

export function ClientProjectsHeader() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text">{t("client.projects.title")}</h1>
      <p className="text-sm text-primary/70">{t("client.projects.subtitle")}</p>
    </div>
  );
}


