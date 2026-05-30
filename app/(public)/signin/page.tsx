"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signInService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES } from "@/constants/UserRoles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPostLoginPath } from "@/services/postLoginRouteService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        let cancelled = false;
        getPostLoginPath().then((path) => {
          if (!cancelled) router.push(path);
        });
        return () => {
          cancelled = true;
        };
      }
    }
  }, [isAuthenticated, loading, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signInService({ email, password });
      login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  if (showAdminSelection) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-r from-blue via-purple to-magent p-4 relative overflow-hidden">
        <Image
          src="/brand/element-onocoactivate.svg"
          alt=""
          fill
          className="absolute inset-0 object-cover z-0 pointer-events-none"
        />
        <Card className="w-full max-w-sm relative z-10">
          <div className="h-1 flex">
            <div className="flex-1 bg-blue"></div>
            <div className="flex-1 bg-magent"></div>
            <div className="flex-1 bg-purple"></div>
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Bienvenido Admin
            </CardTitle>
            <CardDescription className="text-center">
              ¿A dónde deseas ir?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => router.push("/admin")}>
              Ir al Panel de Administración
            </Button>
            <Button
              variant="outline_magent"
              className="w-full"
              onClick={() => router.push("/inicio")}
            >
              Ir a la Aplicación
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-r from-blue via-purple to-magent p-4 relative overflow-hidden">
      <Image
        src="/brand/element-onocoactivate.svg"
        alt=""
        fill
        className="absolute inset-0 object-cover z-0 pointer-events-none"
      />
      <Card className="w-full max-w-md relative z-10">
        <div className="h-1 flex">
          <div className="flex-1 bg-blue"></div>
          <div className="flex-1 bg-magent"></div>
          <div className="flex-1 bg-purple"></div>
        </div>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm whitespace-pre-line">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/signup"
              className="text-blue hover:underline font-medium"
            >
              Registrarse
            </Link>
            {" · "}
            <Link
              href="/reset-password"
              className="text-blue hover:underline font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
