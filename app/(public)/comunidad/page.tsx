import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Globe, HeartHandshake, Instagram } from "lucide-react";
import Image from "next/image";

type Social = {
  platform: "Instagram" | "Facebook";
  label: string;
  url?: string;
};

type Community = {
  name: string;
  description: string;
  web?: string;
  socials: Social[];
};

const communities: Community[] = [
  {
    name: "Fundación Mujeres por un Lazo",
    description:
      "Fundación chilena creada por sobrevivientes de cáncer que busca acompañar, educar y promover la detección precoz, además de impulsar políticas públicas relacionadas con cáncer.",
    web: "www.mujeresporunlazo.org",
    socials: [
      {
        platform: "Instagram",
        label: "@mujeresporunlazo",
        url: "https://www.instagram.com/mujeresporunlazo",
      },
    ],
  },
  {
    name: "Corporación Yo Mujer",
    description:
      "Corporación sin fines de lucro que brinda apoyo integral a mujeres diagnosticadas con cáncer de mama, incluyendo acompañamiento emocional, talleres educativos y actividades de bienestar.",
    web: "corporacionyomujer.cl",
    socials: [
      {
        platform: "Instagram",
        label: "@corporacionyomujer",
        url: "https://www.instagram.com/corporacionyomujer",
      },
    ],
  },
  {
    name: "Fundación Cojín Corazón",
    description:
      "Proyecto solidario que confecciona y entrega cojines terapéuticos gratuitos para mujeres mastectomizadas, diseñados para disminuir dolor y facilitar la recuperación postquirúrgica.",
    socials: [
      {
        platform: "Instagram",
        label: "@cojin_con_corazon",
        url: "https://www.instagram.com/cojin_con_corazon",
      },
    ],
  },
  {
    name: "Triple Negativas Siempre Positivas",
    description:
      "Agrupación de pacientes enfocada específicamente en cáncer de mama triple negativo, que busca visibilizar este subtipo y acompañar a mujeres en Chile.",
    socials: [
      {
        platform: "Instagram",
        label: "@triplenegativa.siemprepositiva",
        url: "https://www.instagram.com/triplenegativa.siemprepositiva",
      },
      {
        platform: "Facebook",
        label: "Triple Negativas Siempre Positivas",
      },
    ],
  },
  {
    name: "Fuerza Rosa",
    description: "ONG de acción social civil para mujeres con cáncer de mama.",
    socials: [
      {
        platform: "Instagram",
        label: "@fuerza_rosa_ong",
        url: "https://www.instagram.com/fuerza_rosa_ong?igsh=dGQ4b2RqMmI2ZXZn",
      },
    ],
  },
  {
    name: "Chile sin Cáncer",
    description:
      "Institución privada sin fines de lucro que busca disminuir la desigualdad de oportunidades frente al cáncer. La fundación articula alianzas público-privadas para entregar mejores oportunidades de diagnóstico y tratamiento frente al cáncer para los adultos atendidos en el sistema público de salud.",
    web: "https://chilesincancer.cl",
    socials: [
      {
        platform: "Instagram",
        label: "@chilesincancer",
        url: "https://www.instagram.com/chilesincancer",
      },
    ],
  },
  {
    name: "Dragonas Rosas Chile",
    description:
      "Equipo de sobrevivientes de cáncer de mama que practican canotaje en bote dragón como parte de su recuperación física y emocional.",
    socials: [
      {
        platform: "Instagram",
        label: "@dragonasrosasdechile",
        url: "https://www.instagram.com/dragonasrosasdechile",
      },
    ],
  },
  {
    name: "Fortale-senos Chile",
    description:
      "Primer equipo chileno de sobrevivientes de cáncer de mama que practica canotaje en bote dragón.",
    socials: [
      {
        platform: "Instagram",
        label: "@dragon_fortale_senos_chile",
        url: "https://www.instagram.com/dragon_fortale_senos_chile",
      },
    ],
  },
  {
    name: "Remadoras Rosas",
    description:
      "Red global de sobrevivientes de cáncer de mama que reman en bote dragón.",
    socials: [
      {
        platform: "Instagram",
        label: "@remadorasrosaschile",
        url: "https://www.instagram.com/remadorasrosaschile",
      },
    ],
  },
  {
    name: "Remo Arriba",
    description:
      "Equipo de mujeres sobrevivientes de cáncer de mama que usan el canotaje como herramienta de rehabilitación y prevención de secuelas.",
    socials: [
      {
        platform: "Instagram",
        label: "@remoarriba",
        url: "https://www.instagram.com/remoarriba",
      },
    ],
  },
  {
    name: "Remadoras Rosas de Los Vientos (Valdivia)",
    description:
      "Grupo regional de mujeres sobrevivientes que practican bote dragón.",
    socials: [
      {
        platform: "Instagram",
        label: "@remarosasdelosvientos",
        url: "https://www.instagram.com/remarosasdelosvientos",
      },
    ],
  },
  {
    name: "Lazos Unidos (Temuco)",
    description: "Red que brinda apoyo a mujeres con cáncer de mama.",
    socials: [
      {
        platform: "Instagram",
        label: "@lazosunidoschile",
        url: "https://www.instagram.com/lazosunidoschile",
      },
    ],
  },
  {
    name: "Somos Fabulosas",
    description:
      "Grupo de mujeres con cáncer de mama que buscan apoyo y contención.",
    socials: [
      {
        platform: "Instagram",
        label: "@somos_fabulosas",
        url: "https://www.instagram.com/somos_fabulosas?igsh=OTk3ampsangxeGxl",
      },
    ],
  },
  {
    name: "Fundación Mama con Cáncer",
    description: "Contención, educación y acompañamiento.",
    web: "fundacionmamaconcancer.cl",
    socials: [
      {
        platform: "Instagram",
        label: "@fundacionmamaconcancer",
        url: "https://www.instagram.com/fundacionmamaconcancer",
      },
    ],
  },
  {
    name: "Remadoras Rosas del Biobío (Concepción)",
    description:
      "Equipo de mujeres sobrevivientes de cáncer de mama que usan el canotaje como herramienta de rehabilitación y prevención de secuelas.",
    socials: [
      {
        platform: "Instagram",
        label: "@remadorasrosasbiobio",
        url: "https://www.instagram.com/remadorasrosasbiobio",
      },
    ],
  },
  {
    name: "Guerreras Hermosas (Coquimbo)",
    description: "Grupo de mujeres con cáncer de mama.",
    socials: [
      {
        platform: "Instagram",
        label: "@guerrerashermosascl",
        url: "https://www.instagram.com/guerrerashermosascl",
      },
    ],
  },
  {
    name: "Las Rosas del Rukapillan (La Araucanía)",
    description:
      "Sobrevivientes de cáncer de mama que practican remo en bote dragón en Villarrica.",
    socials: [
      {
        platform: "Instagram",
        label: "@rosasdelrukapillan_club",
        url: "https://www.instagram.com/rosasdelrukapillan_club",
      },
    ],
  },
];

function normalizeWebUrl(web: string) {
  return web.startsWith("http://") || web.startsWith("https://")
    ? web
    : `https://${web}`;
}

export default function ComunidadPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="relative w-full flex flex-col items-center justify-center gap-8 p-6 md:px-[12%] md:py-20 bg-linear-to-r from-blue via-purple to-magent">
        <Image
          src={"/brand/element-onocoactivate.svg"}
          alt="Elemento decorativo Oncoactivate"
          fill
          className="absolute inset-0 object-cover z-0"
        />
        <div className="flex flex-col items-center gap-4 max-w-4xl text-center z-10">
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Comunidad
          </h1>
          <p className="text-xl font-medium text-white">
            Organizaciones y agrupaciones de apoyo para mujeres con cáncer de
            mama en Chile.
          </p>
        </div>
      </section>

      <section className="w-full p-6 md:px-[10%] md:py-12 bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communities.map((community) => (
            <Card
              key={community.name}
              className="bg-white border shadow-sm gap-2"
            >
              <CardHeader>
                <CardTitle className="text-black-400 text-xl leading-tight font-bold">
                  {community.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-base leading-relaxed text-black-400">
                  {community.description}
                </p>

                {community.web ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Globe className="w-4 h-4 text-magent" />
                    <Button
                      variant="outline_magent"
                      className="h-8 px-3"
                      asChild
                    >
                      <a
                        href={normalizeWebUrl(community.web)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {community.web}
                      </a>
                    </Button>
                  </div>
                ) : null}

                {community.socials.length ? (
                  <div className="flex flex-col gap-2">
                    {community.socials.map((social, index) => (
                      <div
                        key={`${community.name}-${social.platform}-${social.label}-${index}`}
                        className="flex items-center gap-2"
                      >
                        {social.platform === "Instagram" ? (
                          <Instagram className="w-4 h-4 text-magent" />
                        ) : (
                          <Facebook className="w-4 h-4 text-magent" />
                        )}
                        {social.url ? (
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-magent hover:underline"
                          >
                            {social.label}
                          </a>
                        ) : (
                          <span className="text-sm text-black-400">
                            {social.label}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HeartHandshake className="w-4 h-4 text-magent" />
                    Sin información disponible.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
