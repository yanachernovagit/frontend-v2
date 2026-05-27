"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { requestResetPasswordService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/inicio");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await requestResetPasswordService({ email });
      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al enviar el correo de recuperación";
      setError(message);
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

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue via-purple to-magent relative overflow-hidden p-4">
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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Revisa tu correo
            </CardTitle>
            <CardDescription className="text-center">
              Hemos enviado un enlace de recuperación a{" "}
              <span className="font-medium text-black">{email}</span>. Revisa tu
              bandeja de entrada y sigue las instrucciones para restablecer tu
              contraseña.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link
              href="/signin"
              className="text-sm text-blue hover:underline font-medium"
            >
              Volver a iniciar sesión
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue via-purple to-magent relative overflow-hidden p-4">
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
            Recuperar contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center text-gray-600">
            ¿Recordaste tu contraseña?{" "}
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
