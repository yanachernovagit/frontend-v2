"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpService } from "@/services/authService";
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

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/inicio");
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
        phone: formData.phone,
      });

      router.push("/signin?registered=true");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple via-purple/98 to-magent/90 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple/18 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-magent/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="text-center relative z-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-white font-semibold">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple via-purple/98 to-magent/90 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple/18 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-magent/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.5)] border border-white/40 relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple to-magent bg-clip-text text-transparent">
            Crear Cuenta
          </CardTitle>{" "}
          <CardDescription className="text-center text-black-400">
            Completa el formulario para registrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-semibold text-black"
              >
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
                className="border-purple/20 focus:border-purple focus:ring-purple/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-black"
              >
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
                className="border-purple/20 focus:border-purple focus:ring-purple/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-black"
              >
                Teléfono
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 123 456 7890"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="border-purple/20 focus:border-purple focus:ring-purple/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-black"
              >
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
                className="border-purple/20 focus:border-purple focus:ring-purple/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-black"
              >
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
                className="border-purple/20 focus:border-purple focus:ring-purple/20"
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center text-black-400">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/signin"
              className="text-purple hover:text-magent font-semibold transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
