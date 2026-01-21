"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-purple p-4 gap-4">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <main className="bg-white rounded-2xl flex-1 p-6 flex flex-col shadow-lg">
            <AdminHeader />
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
