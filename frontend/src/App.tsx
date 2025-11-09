import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { LoginPage } from "@/pages/auth/Login";
import { AdminAssignmentsPage } from "@/pages/admin/Assignments";
import { AdminClientsPage } from "@/pages/admin/Clients";
import { AdminDashboardPage } from "@/pages/admin/Dashboard";
import { AdminProjectsPage } from "@/pages/admin/Projects";
import { AdminReportsPage } from "@/pages/admin/Reports";
import { AdminSettingsPage } from "@/pages/admin/Settings";
import { AdminTimeEntriesPage } from "@/pages/admin/TimeEntries";
import { ClientDashboardPage } from "@/pages/client/Dashboard";
import { ClientProjectsPage } from "@/pages/client/Projects";
import { ClientReportsPage } from "@/pages/client/Reports";
import { useAuthStore } from "@/store/auth";

function AdminRoutes() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function ClientRoutes() {
  return (
    <ProtectedRoute roles={["CLIENT"]}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function HomeRedirect() {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return user.role === "ADMIN" ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/client/dashboard" replace />
  );
}

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoutes />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="clients" element={<AdminClientsPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="assignments" element={<AdminAssignmentsPage />} />
        <Route path="time-entries" element={<AdminTimeEntriesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="/client" element={<ClientRoutes />}>
        <Route path="dashboard" element={<ClientDashboardPage />} />
        <Route path="projects" element={<ClientProjectsPage />} />
        <Route path="reports" element={<ClientReportsPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


