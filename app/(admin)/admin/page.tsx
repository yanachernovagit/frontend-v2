"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  Dumbbell,
  HelpCircle,
  ListChecks,
  Users,
  ArrowRight,
} from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminStats";

const sections = [
  {
    title: "Evaluaciones",
    description: "Administra pruebas, tiempos y recursos visuales.",
    href: "/admin/evaluations",
    icon: ClipboardCheck,
    color: "purple",
    statKey: "evaluations" as const,
  },
  {
    title: "Ejercicios",
    description: "Gestiona catalogo de ejercicios y videos.",
    href: "/admin/exercises",
    icon: Dumbbell,
    color: "magent",
    statKey: "exercises" as const,
  },
  {
    title: "Rutinas",
    description: "Ordena rutinas y sus iconos.",
    href: "/admin/routines",
    icon: ListChecks,
    color: "blue",
    statKey: "routines" as const,
  },
  {
    title: "Preguntas",
    description: "Configura el perfil con preguntas y dependencias.",
    href: "/admin/questions",
    icon: HelpCircle,
    color: "purple",
    statKey: "questions" as const,
  },
  {
    title: "Usuarios",
    description: "Revisa usuarios y actualiza roles.",
    href: "/admin/users",
    icon: Users,
    color: "magent",
    statKey: "users" as const,
  },
];

const colorMap = {
  purple: "bg-purple/10 text-purple",
  magent: "bg-magent/10 text-magent",
  blue: "bg-blue/10 text-blue",
};

export default function AdminDashboardPage() {
  const { stats, loading } = useAdminStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-gray-500 mt-1">
          Gestión centralizada del contenido de la plataforma
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const colors = colorMap[section.color as keyof typeof colorMap];

          return (
            <Link
              key={section.href}
              href={section.href}
              className="block p-5 bg-white border rounded-xl hover:border-purple/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${colors}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="font-semibold">{section.title}</h3>
                {loading ? (
                  <span className="text-sm text-gray-400">...</span>
                ) : (
                  <span className={`text-sm font-medium ${colors.split(" ")[1]}`}>
                    {stats[section.statKey]}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{section.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Welcome Card */}
      <div className="p-6 bg-purple/5 border border-purple/10 rounded-xl">
        <h2 className="font-semibold mb-2">Bienvenido al Panel de Administración</h2>
        <p className="text-sm text-gray-600">
          Desde aquí puedes gestionar todo el contenido de la plataforma.
          Selecciona una sección para comenzar.
        </p>
      </div>
    </div>
  );
}
