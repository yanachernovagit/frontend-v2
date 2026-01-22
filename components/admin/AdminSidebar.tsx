"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardCheck,
  Dumbbell,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Users,
  Home,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ClipboardCheck, label: "Evaluaciones", href: "/admin/evaluations" },
  { icon: Dumbbell, label: "Ejercicios", href: "/admin/exercises" },
  { icon: ListChecks, label: "Rutinas", href: "/admin/routines" },
  { icon: HelpCircle, label: "Preguntas", href: "/admin/questions" },
  { icon: Users, label: "Usuarios", href: "/admin/users" },
  { icon: ImageIcon, label: "Multimedia", href: "/admin/media" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <aside className="w-64 bg-purple-400/20 rounded-2xl p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl mb-6">
        <div className="p-2 bg-white rounded-lg">
          <Image
            src="/brand/isotype.svg"
            alt="Oncoactivate"
            width={32}
            height={32}
          />
        </div>
        <div>
          <div className="text-white font-bold">Oncoactivate</div>
          <div className="text-white/70 text-xs uppercase tracking-wide">
            Admin
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-white text-purple font-semibold"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-white/20 space-y-2">
        <Link
          href="/inicio"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-colors w-full"
        >
          <Home className="w-5 h-5" />
          <span>Ir a la Aplicación</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:bg-red-500/20 hover:text-red-200 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
