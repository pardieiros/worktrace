import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import defaultLogo from "@assets/worktrace_logo_with_text.png";
import { Button } from "@/components/ui/button";
import { fetchClient, fetchSystemSettings } from "@/lib/queries";
import { resolveMediaUrl } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout
  }));
  const { t, i18n } = useTranslation();

  const { data: systemSettings } = useQuery({
    queryKey: ["system-settings"],
    queryFn: () => fetchSystemSettings(),
    enabled: user?.role === "ADMIN"
  });

  const clientId = user?.role === "CLIENT" ? user?.client ?? null : null;
  const { data: clientData } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => fetchClient(clientId as number),
    enabled: user?.role === "CLIENT" && typeof clientId === "number"
  });

  const rawLogoUrl =
    user?.role === "CLIENT"
      ? clientData?.branding_logo_url ?? null
      : systemSettings?.branding_logo_url ?? null;

  const resolvedLogoUrl = resolveMediaUrl(rawLogoUrl) ?? defaultLogo;

  const logoLabel =
    user?.role === "CLIENT"
      ? clientData?.name ?? t("header.fallbackClientName")
      : user?.role === "ADMIN"
        ? systemSettings?.company_name ?? t("common.appName")
        : t("common.appName");

  const languageOptions = useMemo(
    () => [
      { value: "en", label: `🇬🇧 ${t("header.languages.en")}` },
      { value: "es", label: `🇪🇸 ${t("header.languages.es")}` },
      { value: "fr", label: `🇫🇷 ${t("header.languages.fr")}` },
      { value: "pt", label: `🇵🇹 ${t("header.languages.pt")}` }
    ],
    [t]
  );

  const currentLanguage = useMemo(() => i18n.language.split("-")[0] ?? "en", [i18n.language]);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-primary/10 bg-white/90 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
          aria-label={t("header.openNavigation")}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        <img src={resolvedLogoUrl} alt={logoLabel} className="h-8 w-auto" />
        <span className="hidden text-base font-semibold text-text md:inline">{logoLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="language-selector" className="sr-only">
            {t("header.languageLabel")}
          </label>
          <select
            id="language-selector"
            className="h-9 rounded-md border border-primary/20 bg-white px-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={currentLanguage}
            onChange={(event) => {
              const nextLanguage = event.target.value;
              void i18n.changeLanguage(nextLanguage);
            }}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <ThemeToggle />
        <div className="flex flex-col items-end text-sm">
          <span className="font-semibold text-text">{user?.first_name ?? user?.email}</span>
          <span className="text-primary/80">
            {user?.role === "ADMIN" ? t("common.roles.admin") : t("common.roles.client")}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
        >
          {t("header.logout")}
        </Button>
      </div>
    </header>
  );
}


