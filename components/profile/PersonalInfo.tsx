"use client";

import { PlusCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

function displayValue(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : "-";
}

export function PersonalInfo() {
  const { user } = useAuth();

  return (
    <section className="bg-white">
      <div className="mb-4 flex items-center gap-2">
        <PlusCircle className="h-[22px] w-[22px] text-[#F72585]" />
        <h2 className="text-base font-semibold text-gray-800">
          Informacion Personal
        </h2>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm font-semibold text-gray-700">Tu nombre:</p>
        <div className="rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-gray-900">
            {displayValue(user?.user_metadata?.fullName)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm font-semibold text-gray-700">
          Correo electronico:
        </p>
        <div className="rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-gray-900">{displayValue(user?.email)}</p>
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold text-gray-700">
          Numero de telefono movil:
        </p>
        <div className="rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-gray-900">{displayValue(user?.phone)}</p>
        </div>
      </div>
    </section>
  );
}
