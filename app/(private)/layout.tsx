"use client";

import { useEffect } from "react";
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
import { Home, Shield, LogOut, Dumbbell, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useUserTasks } from "@/hooks/useUserTasks";
import { LoggedUserHeader } from "@/components/shared/LoggedUserHeader";
import { hasProfileQuestionsSkipped } from "@/services/postLoginRouteService";

const menuItems = [
  { icon: Home, label: "Inicio", href: "/inicio" },
  { icon: User, label: "Mi perfil", href: "/perfil" },
  { icon: Dumbbell, label: "Mi plan", href: "/plan" },
  /* { icon: TrendingUp, label: "Mi progreso", href: "/progreso" }, */
  { icon: Shield, label: "Test de evaluación", href: "/evaluaciones" },
  /* { icon: Users, label: "Comunidad", href: "/comunidad" },
  { icon: HelpCircle, label: "Ayuda", href: "/ayuda" }, */
];

const SIDEBAR_WIDTH = "15%";

function PrivateShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const {
    userTasks,
    loading: loadingTasks,
    error: tasksError,
  } = useUserTasks();

  const isOnboardingRoute = pathname === "/preguntas";
  const skipUserId =
    userTasks?.userId && userTasks.userId !== "empty"
      ? userTasks.userId
      : user?.sub;
  const skippedForCurrentUser = hasProfileQuestionsSkipped(skipUserId);
  const hasIncompleteProfile =
    !!userTasks && userTasks.profileCompleted === false;

  useEffect(() => {
    if (
      !loadingTasks &&
      !tasksError &&
      hasIncompleteProfile &&
      !skippedForCurrentUser &&
      !isOnboardingRoute
    ) {
      router.replace("/preguntas");
    }
  }, [
    hasIncompleteProfile,
    isOnboardingRoute,
    loadingTasks,
    pathname,
    router,
    skippedForCurrentUser,
    tasksError,
  ]);

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  if (
    !isOnboardingRoute &&
    !tasksError &&
    ((loadingTasks && !skippedForCurrentUser) ||
      (!userTasks && !skippedForCurrentUser) ||
      (hasIncompleteProfile && !skippedForCurrentUser))
  ) {
    return null;
  }

  return (
    <>
      {/* Mobile message */}
      <div className="flex lg:hidden h-screen w-full bg-linear-to-r from-blue via-purple to-magent items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
          <Image
            src="/brand/isotype.svg"
            alt="Oncoactivate"
            width={64}
            height={64}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Tenemos una app
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Para una mejor experiencia, descarga la app de{" "}
            <span className="font-semibold text-purple">OncoActivate</span>{" "}
            disponible en App Store y Play Store.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="https://apps.apple.com/app/id6753783749"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Descargar en App Store
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.oncoactivate.app"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Descargar en Play Store
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <SidebarProvider defaultOpen={true}>
        <div className="hidden md:flex h-screen w-full bg-blue p-5 gap-8">
          <div style={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
            <Sidebar className="border-none w-full" collapsible="none">
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
                          <a
                            href={item.href}
                            className="flex items-center gap-3"
                          >
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
          </div>

          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <main className="bg-white rounded-3xl flex-1 overflow-hidden p-4 flex flex-col min-h-0">
              <LoggedUserHeader />
              <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <PrivateShell>{children}</PrivateShell>
    </AuthGuard>
  );
}
