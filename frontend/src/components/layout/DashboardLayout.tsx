import { useState } from "react";
import type { ReactNode } from "react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface text-text">
      <Sidebar open={sidebarOpen} />
      <div className="flex flex-1 flex-col md:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

