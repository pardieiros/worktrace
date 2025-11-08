import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuthStore } from "@/store/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<"ADMIN" | "CLIENT">;
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, status } = useAuthStore();
  const location = useLocation();

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || status !== "authenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

