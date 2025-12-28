"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import TeamSection from "@/components/TeamSection";
import { useEffect, useRef, useState } from "react";

export default function AboutUs() {
  const [isSection1Visible, setIsSection1Visible] = useState(false);
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer1 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSection1Visible(true);
        }
      },
      { threshold: 0.1 },
    );

    const observer2 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSection2Visible(true);
        }
      },
      { threshold: 0.1 },
    );

    const currentSection1 = section1Ref.current;
    const currentSection2 = section2Ref.current;

    if (currentSection1) observer1.observe(currentSection1);
    if (currentSection2) observer2.observe(currentSection2);

    return () => {
      if (currentSection1) observer1.unobserve(currentSection1);
      if (currentSection2) observer2.unobserve(currentSection2);
    };
  }, []);

  return (
    <div className="flex flex-col w-full px-6 md:px-[15%]">
      <section className="w-full flex flex-col items-start py-20">
        <div className="flex flex-col">
          <h1 className="font-bold text-magent text-3xl md:text-4xl">
            Nuestro programa
          </h1>
          <p className="text-xl font-medium mt-5">
            Oncoactívate es una plataforma web y móvil diseñada para mejorar la
            calidad de vida de las personas diagnosticadas con cáncer de mama. A
            través de esta innovadora herramienta, los usuarios pueden acceder a
            una guía de ejercicios recomendados que funcionan como terapia
            física para fortalecer el cuerpo y el espíritu durante y después del
            tratamiento. La plataforma no solo ofrece un programa de ejercicios
            personalizado, sino que también permite a los usuarios evaluar su
            progreso, lo que facilita la adaptación y optimización del plan de
            acuerdo a sus necesidades y capacidades individuales.
          </p>
        </div>
        <div className="flex flex-col mt-16">
          <h2 className="font-bold text-xl md:text-2xl">
            Oncoactívate, una red de apoyo
          </h2>
          <p className="text-xl font-medium mt-5">
            Además de la guía de ejercicios, Oncoactívate brinda la oportunidad
            de formar parte de una comunidad de apoyo, donde los usuarios pueden
            compartir experiencias y encontrar motivación y consuelo en las
            historias de otros que enfrentan retos similares. Esta red de apoyo
            se complementa con recursos educativos que proporcionan información
            valiosa sobre el cáncer de mama, los beneficios del ejercicio
            durante el tratamiento y consejos para mantener un estilo de vida
            saludable.
          </p>
          <p className="text-xl font-medium mt-5">
            Oncoactívate se posiciona como un aliado esencial en el camino hacia
            la recuperación, ofreciendo no solo herramientas físicas, sino
            también emocionales y educativas, para enfrentar el cáncer de mama
            con una actitud activa y positiva. Con cada paso que los usuarios
            dan en la plataforma, se fortalece su compromiso con su salud y
            bienestar, haciendo de Oncoactívate una parte integral de su viaje
            hacia una vida más saludable y plena.
          </p>
        </div>
      </section>

      <section ref={section1Ref} className="w-full py-5">
        <h2 className="font-bold text-magent text-3xl md:text-4xl mb-16 text-center">
          ¿Por qué ser parte de Oncoactivate?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            className={`border shadow-lg hover:shadow-xl transition-all duration-500 bg-secondary ${
              isSection1Visible ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: isSection1Visible ? "0s" : "0s" }}
          >
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="w-24 h-24 mb-6 flex items-center justify-center">
                <Image
                  src="/icons-about-us/Info.svg"
                  alt="Information icon"
                  width={70}
                  height={70}
                />
              </div>
              <p className="text-lg font-medium leading-relaxed">
                Adquieres información confiable y actualizada sobre el cáncer de
                mama y la rehabilitación física
              </p>
            </CardContent>
          </Card>

          <Card
            className={`border shadow-lg hover:shadow-xl transition-all duration-500 bg-secondary ${
              isSection1Visible ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: isSection1Visible ? "0.15s" : "0s" }}
          >
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="w-24 h-24 mb-6 flex items-center justify-center">
                <Image
                  src="/icons-about-us/Recommendation.svg"
                  alt="Empathy icon"
                  width={70}
                  height={70}
                />
              </div>
              <p className="text-lg font-medium leading-relaxed">
                Encuentras recursos especializados, adaptados a los distintos
                procesos del tratamiento por cáncer de mama
              </p>
            </CardContent>
          </Card>

          <Card
            className={`border shadow-lg hover:shadow-xl transition-all duration-500 bg-secondary ${
              isSection1Visible ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: isSection1Visible ? "0.3s" : "0s" }}
          >
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="w-24 h-24 mb-6 flex items-center justify-center">
                <Image
                  src="/icons-about-us/Female-meeting.svg"
                  alt="Community icon"
                  width={70}
                  height={70}
                />
              </div>
              <p className="text-lg font-medium leading-relaxed">
                Tienes la posibilidad de estar conectadas con personas que
                comparten experiencias similares, creando comunidad
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section ref={section2Ref} className="w-full py-32">
        <h2 className="font-bold text-center text-2xl md:text-3xl mb-20 max-w-5xl mx-auto text-black-400">
          Nuestra misión es facilitar la recuperación integral de pacientes con
          cáncer de mama mediante información y terapia física, promovemos un
          enfoque activo en su bienestar.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <Card
            className={`border shadow-lg hover:shadow-xl transition-all duration-500 bg-white ${
              isSection2Visible ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: isSection2Visible ? "0s" : "0s" }}
          >
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="w-24 h-24 mb-6 flex items-center justify-center">
                <Image
                  src="/icons-about-us/Recovery.svg"
                  alt="Recovery icon"
                  width={70}
                  height={70}
                />
              </div>
              <h3 className="font-bold text-lg mb-3">
                Enfoque en la recuperación
              </h3>
              <p className="text-lg font-medium leading-relaxed">
                Nos centramos en el objetivo que es ayudar a los sobrevivientes
                de cáncer a recuperar su salud física y su calidad de vida a
                través de la terapia física.
              </p>
            </CardContent>
          </Card>

          <Card
            className={`border shadow-lg hover:shadow-xl transition-all duration-500 bg-white ${
              isSection2Visible ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: isSection2Visible ? "0.15s" : "0s" }}
          >
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="w-24 h-24 mb-6 flex items-center justify-center">
                <Image
                  src="/icons-about-us/Empathy.svg"
                  alt="Empathy icon"
                  width={70}
                  height={70}
                />
              </div>
              <h3 className="font-bold text-lg mb-3">Empatía y compasión</h3>
              <p className="text-lg font-medium leading-relaxed">
                Comprendemos las experiencias y desafíos de los pacientes con
                cáncer de mama.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <TeamSection />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
