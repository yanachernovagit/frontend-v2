"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES } from "@/constants/UserRoles";

export default function SignInPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminSelection, setShowAdminSelection] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.user_metadata?.role === USER_ROLES.ADMIN) {
        setShowAdminSelection(true);
      } else {
        router.push("/inicio");
      }
    }
  }, [isAuthenticated, loading, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signInService({ email, password });
      login(response.accessToken);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  if (showAdminSelection) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-purple p-4">
        <div className="w-full max-w-sm bg-white rounded-xl p-6">
          <h1 className="text-xl font-bold text-center mb-6">
            Bienvenido Admin
          </h1>
          <p className="text-center mb-6 text-gray-600">¿A dónde deseas ir?</p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/admin")}
              className="w-full bg-purple text-white py-3 rounded-lg hover:bg-purple/90 transition-colors font-medium"
            >
              Ir al Panel de Administración
            </button>

            <button
              onClick={() => router.push("/inicio")}
              className="w-full bg-white text-purple border border-purple py-3 rounded-lg hover:bg-purple/5 transition-colors font-medium"
            >
              Ir a la Aplicación
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-purple p-4">
      <div className="w-full max-w-sm bg-white rounded-xl p-6">
        <h1 className="text-xl font-bold text-center mb-4">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple text-white py-2 rounded"
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/signup" className="text-purple">
            Registrarse
          </Link>
          {" | "}
          <Link href="/reset-password" className="text-purple">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
