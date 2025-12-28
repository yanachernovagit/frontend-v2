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
      "Soy Karol Ramírez, una destacada kinesióloga y profesora asistente en la Facultad de Medicina, Departamento de Kinesiología de la Universidad Católica de Chile, donde también desempeño un rol crucial como Docente Asistencial en el Centro Oncológico del Complejo Asistencial Dr. Sótero del Río. Me gradué en la Universidad Católica de Maule y obtuve un Magíster en Administración en Salud de la Universidad Andrés Bello, y actualmente profundizo mi educación como candidata a doctorado en Medicina Clínica y Salud Pública en la Universidad de Granada. Mi motivación para participar en Oncoactívate surge de mi compromiso con la innovación en tratamientos para el cáncer, buscando siempre formas de mejorar la calidad de vida de los pacientes. Fuera de mis compromisos académicos y profesionales, disfruto de las danzas españolas y de excursiones a cerros con amigos y familia, lo que enriquece mi vida con balance y pasión. Mi energía y dedicación inspiran tanto a estudiantes como a colegas, destacándome en mi campo.",
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
      "¡Hola! Soy Scarlet, soy alegre, optimista, me gusta hacer ejercicio, disfruto de conocer nuevos lugares y tomar fotos bonitas. También, soy kinesióloga de la Pontificia Universidad Católica de Chile, donde me formé en rehabilitación kinésica en pacientes oncológicos. Mi día a día transcurre entre la Unidad de Oncología Ambulatoria del Hospital Sótero del Río y los cuidados paliativos domiciliarios, lugares que me han enseñado a amar mi quehacer y valorar la importancia de la kinesiología en todas las etapas del cáncer. Estas experiencias y la necesidad de que toda persona con diagnóstico de cáncer tenga acceso a la rehabilitación me han motivado a participar de Oncoactívate, creo fervientemente en el impacto transformador del ejercicio en la vida de las personas. Estoy aquí para brindarles herramientas y que juntas, tengamos una vida más activa.",
  },
  {
    name: "Yana Chernova",
    image: "/img-team/Yana.png",
    description:
      "Soy una desarrolladora de software de Ucrania, trabajando en el sector bancario. Mi motivación para crear Oncoactívate proviene de una experiencia personal: mi abuela falleció a causa del cáncer de mama. A través de esta aplicación, quiero ofrecer apoyo e información a quienes luchan contra esta enfermedad. Me apasiona el deporte y disfruto pasar tiempo con mis dos perros. Creo en el equilibrio entre el trabajo y la vida personal, y en el poder de la tecnología para hacer el bien. Con Oncoactívate, espero marcar una diferencia significativa en la vida de muchas personas.",
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
