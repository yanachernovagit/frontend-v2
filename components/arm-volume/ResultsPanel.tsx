"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

import { useCommonUtils } from "@/hooks/useCommonUtils";

export type Results = {
  difference: number;
  leftVolume: number;
  rightVolume: number;
};

type HealthStatus = {
  color: string;
  bgClass: string;
  borderClass: string;
  icon: React.ReactNode;
  message: string;
  description: string;
};

function getHealthStatus(difference: number): HealthStatus {
  if (difference <= 150) {
    return {
      color: "#10B981",
      bgClass: "bg-green-50",
      borderClass: "border-green-500",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      message: "Normalidad",
      description: "0–150 ml: normalidad",
    };
  }
  if (difference <= 200) {
    return {
      color: "#F59E0B",
      bgClass: "bg-yellow-50",
      borderClass: "border-yellow-500",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      message: "Se sugiere consultar con kinesiólogo",
      description: ">150 ml: se sugiere consultar con kinesiólogo",
    };
  }
  return {
    color: "#EF4444",
    bgClass: "bg-red-50",
    borderClass: "border-red-500",
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    message: "Consultar de forma precoz con kinesiólogo",
    description: ">200 ml: consultar de forma precoz con kinesiólogo",
  };
}

export function ResultsPanel({ results }: { results: Results | null }) {
  const { formatDisplayNumber } = useCommonUtils();
  const status = results ? getHealthStatus(results.difference) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-purple rounded-2xl p-4 sm:p-5 grid grid-cols-3 gap-2 sm:gap-4 text-white">
        <div>
          <p className="text-xs sm:text-sm font-medium text-white/60 mb-1">
            Volumen brazo izquierdo
          </p>
          <p className="text-base sm:text-xl font-bold text-magent">
            {results ? `${formatDisplayNumber(results.leftVolume)} ml` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-white/60 mb-1">
            Volumen brazo derecho
          </p>
          <p className="text-base sm:text-xl font-bold text-magent">
            {results ? `${formatDisplayNumber(results.rightVolume)} ml` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-white/60 mb-1">
            Diferencia de volumen
          </p>
          {results && status ? (
            <p
              className="text-base sm:text-xl font-bold"
              style={{ color: status.color }}
            >
              {formatDisplayNumber(results.difference)} ml
            </p>
          ) : (
            <p className="text-base sm:text-xl font-bold text-white/40">—</p>
          )}
        </div>
      </div>

      {status ? (
        <div
          className={`${status.bgClass} ${status.borderClass} border-2 rounded-xl p-4 flex items-start gap-3`}
        >
          {status.icon}
          <div>
            <p className="font-bold text-base" style={{ color: status.color }}>
              {status.message}
            </p>
            <p className="mt-1 text-sm text-gray-600">{status.description}</p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 text-sm">
          Los resultados aparecerán aquí después de calcular
        </div>
      )}
    </div>
  );
}
