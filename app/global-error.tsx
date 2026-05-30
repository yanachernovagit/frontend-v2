"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { captureFrontendException } from "@/lib/posthog";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
    captureFrontendException(error, {
      boundary: "global",
      digest: error.digest ?? null,
    });
  }, [error]);

  return (
    <html lang="es">
      <body>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <section className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-lg font-bold text-black">Algo salió mal</h1>
            <p className="mt-2 text-sm text-gray-500">
              La aplicación no pudo cargar correctamente. Intenta nuevamente.
            </p>
            <button
              onClick={reset}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple/90"
            >
              <RotateCcw className="h-4 w-4" />
              Reintentar
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
