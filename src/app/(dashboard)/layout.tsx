import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthInit } from "@/components/auth/auth-init";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <AuthInit />
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
