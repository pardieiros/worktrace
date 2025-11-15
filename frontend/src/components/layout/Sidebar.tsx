import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  ClipboardList,
  FileSpreadsheet,
  LayoutGrid,
  Settings,
  Users
} from "lucide-react";
import { useTranslation } from "react-i18next";

import icon from "@assets/worktrace_icon_vector.svg";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

interface SidebarProps {
  open?: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const adminLinks = useMemo(
    () => [
      { to: "/admin/dashboard", label: t("sidebar.links.dashboard"), icon: LayoutGrid },
      { to: "/admin/clients", label: t("sidebar.links.clients"), icon: Users },
      { to: "/admin/projects", label: t("sidebar.links.projects"), icon: Briefcase },
      { to: "/admin/assignments", label: t("sidebar.links.assignments"), icon: ClipboardList },
      { to: "/admin/time-entries", label: t("sidebar.links.timeEntries"), icon: FileSpreadsheet },
      { to: "/admin/reports", label: t("sidebar.links.reports"), icon: BarChart3 },
      { to: "/admin/settings", label: t("sidebar.links.settings"), icon: Settings }
    ],
    [t]
  );

  const clientLinks = useMemo(
    () => [
      { to: "/client/dashboard", label: t("sidebar.links.dashboard"), icon: LayoutGrid },
      { to: "/client/projects", label: t("sidebar.links.projects"), icon: Briefcase },
      { to: "/client/reports", label: t("sidebar.links.reports"), icon: BarChart3 }
    ],
    [t]
  );

  const links = user?.role === "ADMIN" ? adminLinks : clientLinks;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-primary/10 bg-white p-6 transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="mb-8 flex items-center gap-3">
        <img src={icon} alt={t("sidebar.iconAlt")} className="h-10 w-10" />
        <div>
          <p className="text-lg font-semibold text-text">{t("common.appName")}</p>
          <p className="text-xs text-primary/70">{t("sidebar.tagline")}</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-card"
                    : "text-text hover:bg-primary-weak/40"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-8 rounded-lg border border-primary/10 bg-primary-weak/30 p-3 text-xs text-text/80">
        <p>
          <strong>{t("sidebar.supportLabel")}</strong> {t("sidebar.supportEmail")}
        </p>
        <p>{t("sidebar.accessibilityNote")}</p>
      </div>
    </aside>
  );
}


