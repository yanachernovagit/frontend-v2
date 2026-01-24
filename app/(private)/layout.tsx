"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Home, Shield, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { LoggedUserHeader } from "@/components/shared/LoggedUserHeader";

const menuItems = [
  { icon: Home, label: "Inicio", href: "/inicio" },
  /* { icon: User, label: "Mi perfil", href: "/perfil" }, */
  /* { icon: Dumbbell, label: "Mi plan", href: "/plan" }, */
  /* { icon: TrendingUp, label: "Mi progreso", href: "/progreso" }, */
  { icon: Shield, label: "Test de evaluación", href: "/evaluaciones" },
  /* { icon: Users, label: "Comunidad", href: "/comunidad" },
  { icon: HelpCircle, label: "Ayuda", href: "/ayuda" }, */
];

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-blue p-5 gap-8">
          <Sidebar className="border-none" collapsible="none">
            <SidebarHeader className="mb-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/brand/isotype.svg"
                  alt="Oncoactivate"
                  width={50}
                  height={50}
                />
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu className="gap-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`h-12 ${
                          isActive
                            ? "text-magent hover:text-magent hover:bg-white/10"
                            : "text-white hover:bg-white/10"
                        } data-[active=true]:bg-white/10`}
                      >
                        <a href={item.href} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="text-base">{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="text-white hover:bg-white/10 h-12"
                    asChild
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-base">Cerrar sesión</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 flex flex-col min-h-0">
            <main className="bg-white rounded-3xl flex-1 overflow-hidden p-4 flex flex-col min-h-0">
              <LoggedUserHeader />
              <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
