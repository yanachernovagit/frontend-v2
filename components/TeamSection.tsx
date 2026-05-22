"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface TeamMember {
  name: string;
  image: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Denise Montt",
    image: "/img-team/Denise.png",
    description:
      "Soy una entusiasta maratonista que disfruta cada kilómetro. Además, me apasiona aprender y cocinar nuevas recetas. Soy diseñadora egresada de la Pontificia Universidad Católica de Chile y me dedico al desarrollo de innovaciones en salud que fomentan la actividad física en pacientes con enfermedades crónicas. Me especialicé con un Magíster en Ciencias de la Salud y actualmente estoy finalizando mi tesis doctoral en Ciencias Médicas en la misma universidad. En mi rol docente, colaboré con la Unidad de Oncología Ambulatoria del Hospital Sótero del Río, donde descubrí un gran potencial para mejorar la calidad de vida de las pacientes con cáncer de mama a través del diseño. Mi enfoque incluye facilitar la comprensión de la información médica, conectar con la identidad de las pacientes y ofrecer soluciones que se adapten a su realidad y contexto, entre otros aspectos que me motivaron a participar en Oncoactívate y promover los beneficios de la actividad física.",
  },
  {
    name: "Karol Ramírez",
    image: "/img-team/Karol.png",
    description:
      "Hola, soy Karol Ramírez, kinesióloga y profesora investigadora en la Universidad Andrés Bello. Me formé en la Universidad Católica del Maule, luego realicé un Magíster en Administración en Salud en la UNAB y un doctorado en Medicina Clínica y Salud Pública en la Universidad de Granada. Me motiva aportar, desde mi trabajo, a mejorar la calidad de vida de las personas con cáncer, explorando nuevas formas de integrar la rehabilitación en su proceso. En ese camino, he tenido la oportunidad de participar en iniciativas como Oncoactívate. Fuera de lo profesional, disfruto las danzas españolas y salir a cerros con amigos y familia, espacios que me ayudan a mantener el equilibrio y recargar energía.",
  },
  {
    name: "Francisca Torres",
    image: "/img-team/Francisca.png",
    description:
      "Soy Francisca Torres, Ingeniera Civil Industrial de la Pontificia Universidad Católica de Chile, con amplia experiencia en instituciones financieras, donde me he destacado como ejecutiva gerencial en control de gestión, gastos y proveedores. Especialista en eficiencia de costos, me enfoco en asegurar la continuidad del negocio sin comprometer la experiencia del cliente. Actualmente, soy directora de proyectos en Fundación Rafa, impulsando comunidades compasivas para mejorar la calidad de vida de pacientes vulnerables. Como miembro activa del Santiago Runner Club, estoy comprometida con la promoción de la actividad física y la innovación en salud. Continúo perfeccionándome en cuidados paliativos y atención al final de la vida.",
  },
  {
    name: "Scarlet Muñoz",
    image: "/img-team/Scarlet.png",
    description:
      "Hola, soy Scarlet. Me considero una persona alegre y optimista; disfruto hacer ejercicio, conocer nuevos lugares y tomar fotos bonitas. También, soy kinesióloga de la Pontificia Universidad Católica de Chile, donde me formé en rehabilitación oncológica. Actualmente me encuentro cursando un magister de fisiología clínica del ejercicio en la universidad Finis Terrae. Mi día a día se divide entre la atención de pacientes oncológicos en Clínica Las Condes, los cuidados paliativos domiciliarios en UC Christus y la investigación, estos espacios me han permitido valorar profundamente el rol de la kinesiología en todas las etapas del cáncer. Las experiencias, junto con la creencia de que toda persona con diagnóstico de cáncer debería acceder a rehabilitación, me motivaron a ser parte de Oncoactívate. Creo en el impacto transformador del ejercicio, por ello mi objetivo es acompañarlas, entregándoles herramientas para que juntas construyamos una vida más activa.",
  },
];

export default function TeamSection() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      },
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full pb-10">
      <div className="flex flex-col mb-10">
        <h2 className="font-bold text-magent text-3xl md:text-4xl">
          Quiénes somos
        </h2>
        <p className="text-xl font-medium mt-5">
          Somos un equipo interdisciplinar de mujeres que aportan desde
          distintos saberes. Nos hemos unido para crear un espacio acogedor y
          educativo, ofreciendo apoyo a aquellos que han enfrentado el desafío
          del cáncer y sus tratamientos.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <Card
            key={index}
            className={`border border-gray-200 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 bg-gray-50 overflow-hidden ${
              isVisible ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{
              animationDelay: isVisible ? `${index * 0.15}s` : "0s",
            }}
          >
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="relative shrink-0 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-blue transition-transform duration-500 hover:scale-105">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="w-full">
                <h3 className="font-bold text-xl mb-3">{member.name}</h3>
                <p className="text-base leading-relaxed text-gray-700 mb-4">
                  {expandedCard === index
                    ? member.description
                    : member.description.length > 120
                      ? `${member.description.substring(0, 120)}...`
                      : member.description}
                </p>
                {member.description.length > 120 && (
                  <button
                    onClick={() =>
                      setExpandedCard(expandedCard === index ? null : index)
                    }
                    className="text-blue font-medium underline hover:text-blue transition-colors duration-300"
                  >
                    {expandedCard === index ? "Leer menos" : "Leer más"}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </section>
  );
}
