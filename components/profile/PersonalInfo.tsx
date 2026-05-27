"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { updateProfileService } from "@/services/profileService";
import { Button } from "@/components/ui/button";

function displayValue(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : "-";
}

export function PersonalInfo() {
  const { user, refreshSession } = useAuth();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const currentFullName = useMemo(
    () =>
      typeof user?.user_metadata?.fullName === "string"
        ? user.user_metadata.fullName
        : "",
    [user],
  );

  useEffect(() => {
    setFullName(currentFullName);
  }, [currentFullName]);

  const isChanged = fullName.trim() !== currentFullName.trim();

  const handleSave = async () => {
    const normalizedName = fullName.trim();
    if (normalizedName.length < 2 || normalizedName.length > 100) {
      setStatus({
        type: "error",
        text: "El nombre debe tener entre 2 y 100 caracteres.",
      });
      return;
    }

    if (!isChanged || saving) return;

    try {
      setSaving(true);
      setStatus(null);
      await updateProfileService({ fullName: normalizedName });
      await refreshSession();
      setStatus({ type: "success", text: "Nombre actualizado." });
    } catch {
      setStatus({
        type: "error",
        text: "No se pudo actualizar el nombre. Intenta nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  };

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
        <div className="space-y-3">
          <input
            type="text"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              if (status) setStatus(null);
            }}
            placeholder="Escribe tu nombre completo"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-magent focus:ring-2 focus:ring-magent/20"
          />
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isChanged || saving}
            className="min-h-[44px]"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
          {status ? (
            <p
              className={`text-sm ${
                status.type === "error" ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {status.text}
            </p>
          ) : null}
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
    </section>
  );
}
