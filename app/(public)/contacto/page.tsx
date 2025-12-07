"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Facebook, Instagram, Twitter, Linkedin, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Contacto() {
  const [emailCopied, setEmailCopied] = useState(false);

  const contactEmail = "contacto@oncoactivate.com";
  const contactPhone = "+56 9 1234 5678";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/oncoactivate",
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/oncoactivate",
      color: "hover:text-pink-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/oncoactivate",
      color: "hover:text-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/company/oncoactivate",
      color: "hover:text-blue-700",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-linear-to-r from-blue via-purple to-magent">
      <section className="relative w-full flex flex-col items-center justify-center gap-10 p-6 md:px-[12%] md:py-20">
        <Image
          src={"/brand/element-onocoactivate.svg"}
          alt="Elemento decorativo Oncoactivate"
          fill
          className="absolute inset-0 object-cover z-0"
        />
        <div className="flex flex-col items-center gap-5 max-w-3xl text-center z-10">
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Contacto
          </h1>
          <p className="text-xl font-medium text-white">
            ¿Tienes preguntas o quieres saber más sobre nuestro programa?
            Estamos aquí para ayudarte. Contáctanos a través de cualquiera
            de nuestros canales.
          </p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
          {/* Email Card */}
          <Card className="bg-white z-10">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <div className="w-16 h-16 rounded-full bg-magent/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-magent" />
              </div>
              <h3 className="font-bold text-xl text-black-400">Correo Electrónico</h3>
              <button
                onClick={handleCopyEmail}
                className="text-lg text-magent hover:underline transition-all flex items-center gap-2"
              >
                {emailCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Copiado!
                  </>
                ) : (
                  contactEmail
                )}
              </button>
              <p className="text-sm text-gray-600">
                {emailCopied ? "El correo se copió al portapapeles" : "Haz clic para copiar"}
              </p>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="bg-white z-10">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <div className="w-16 h-16 rounded-full bg-magent/10 flex items-center justify-center">
                <Phone className="w-8 h-8 text-magent" />
              </div>
              <h3 className="font-bold text-xl text-black-400">Teléfono</h3>
              <a
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                className="text-lg text-magent hover:underline transition-all"
              >
                {contactPhone}
              </a>
              <p className="text-sm text-gray-600">
                Llámanos de lunes a viernes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Section */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-8 mt-8 z-10">
          <h2 className="font-bold text-2xl md:text-3xl text-white">
            Síguenos en Redes Sociales
          </h2>
          <div className="flex flex-wrap justify-center gap-6 z-10">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-white hover:shadow-lg transition-all w-36 h-36 ${social.color}`}
                >
                  <Icon className="w-10 h-10" />
                  <span className="font-medium text-base">{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="w-full max-w-4xl mt-12 z-10">
          <Card className="bg-white z-10">
            <CardContent className="p-8 text-center">
              <h3 className="font-bold text-2xl text-black-400 mb-4">
                ¿Quieres unirte a nuestra comunidad?
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Regístrate y sé parte de Oncoactívate. Juntos avanzamos hacia una vida más activa.
              </p>
              <Button className="px-16 py-5 text-xl">
                Regístrate Ahora
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
