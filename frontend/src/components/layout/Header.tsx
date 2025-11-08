import { MenuIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "@assets/worktrace_logo_with_text.png";
import { Button } from "@/components/ui/button";
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

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-primary/10 bg-white/90 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar} aria-label="Abrir navegação">
          <MenuIcon className="h-5 w-5" />
        </Button>
        <img src={logo} alt="Worktrace" className="h-8 w-auto" />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="flex flex-col items-end text-sm">
          <span className="font-semibold text-text">{user?.first_name ?? user?.email}</span>
          <span className="text-primary/80">{user?.role === "ADMIN" ? "Admin" : "Cliente"}</span>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
        >
          Terminar sessão
        </Button>
      </div>
    </header>
  );
}

