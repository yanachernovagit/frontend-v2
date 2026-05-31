"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInService, signUpService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
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

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated, loading, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const completedSignupRef = useRef(false);

  useEffect(() => {
    if (!loading && isAuthenticated && !completedSignupRef.current) {
      let cancelled = false;
      getPostLoginPath().then((path) => {
        if (!cancelled) router.push(path);
      });
      return () => {
        cancelled = true;
      };
    }
  }, [isAuthenticated, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await signUpService({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      const session = await signInService({
        email: formData.email,
        password: formData.password,
      });

      login({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });

      completedSignupRef.current = true;
      router.push(await getPostLoginPath());
    } catch (err: unknown) {
      completedSignupRef.current = false;
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue via-purple to-magent relative overflow-hidden">
        <Image
          src="/brand/element-onocoactivate.svg"
          alt=""
          fill
          className="absolute inset-0 object-cover z-0 pointer-events-none"
        />
        <div className="text-center relative z-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-white font-semibold">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue via-purple to-magent p-4 relative overflow-hidden">
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
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Completa el formulario para registrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Nombre completo
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Juan Pérez"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar contraseña
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/signin"
              className="text-blue hover:underline font-medium"
            >
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
