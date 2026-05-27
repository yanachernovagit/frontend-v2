"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border-2 border-red-200 shadow-lg text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-black">Algo salio mal</h2>
        <p className="text-sm text-gray-500">
          Ocurrio un error inesperado en el panel de administracion. Intenta
          recargar la seccion.
        </p>
        {error.message && (
          <pre className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 overflow-auto max-h-32 text-left">
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple to-magent text-white font-semibold text-sm hover:from-purple/90 hover:to-magent/90 transition-all shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    </div>
  );
}
