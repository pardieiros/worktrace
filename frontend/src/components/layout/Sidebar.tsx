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

import icon from "@assets/worktrace_icon_vector.svg";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

interface SidebarProps {
  open?: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const { user } = useAuthStore();

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/admin/clients", label: "Clientes", icon: Users },
    { to: "/admin/projects", label: "Projetos", icon: Briefcase },
    { to: "/admin/assignments", label: "Atribuições", icon: ClipboardList },
    { to: "/admin/time-entries", label: "Horas", icon: FileSpreadsheet },
    { to: "/admin/reports", label: "Relatórios", icon: BarChart3 },
    { to: "/admin/settings", label: "Definições", icon: Settings }
  ];

  const clientLinks = [
    { to: "/client/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/client/projects", label: "Projetos", icon: Briefcase },
    { to: "/client/reports", label: "Relatórios", icon: BarChart3 }
  ];

  const links = user?.role === "ADMIN" ? adminLinks : clientLinks;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-primary/10 bg-white p-6 transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="mb-8 flex items-center gap-3">
        <img src={icon} alt="Worktrace icon" className="h-10 w-10" />
        <div>
          <p className="text-lg font-semibold text-text">Worktrace</p>
          <p className="text-xs text-primary/70">Tempo e transparência</p>
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
        <p><strong>Suporte:</strong> support@worktrace.app</p>
        <p>Actualizado para WCAG AA e cookies HttpOnly.</p>
      </div>
    </aside>
  );
}

