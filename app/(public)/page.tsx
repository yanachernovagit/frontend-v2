import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full h-screen flex items-center justify-start px-6 md:px-[12%]">
        <div className="flex flex-col gap-5 md:gap-10 z-20 md:mt-24">
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Bienvenidas a Oncoactívate
          </h1>
          <p className="text-white text-2xl font-medium max-w-lg">
            Explora recursos, haz tu terapia física y se parte de la comunidad
            Oncoactivate. ¡Juntos avanzamos hacia una vida más activa!
          </p>
          <Button className="w-fit px-16 py-5 text-xl">Regístrate</Button>
        </div>
        <Image
          src={"/img/woman-hero-desktop.jpg"}
          alt="Mujer ejercitandose"
          fill
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black/50 z-0" />
        <Image
          src={"/brand/element-onocoactivate.svg"}
          alt="Elemento decorativo Oncoactivate"
          fill
          className="absolute inset-0 object-cover z-10"
        />
      </section>
      <section className="relative w-full flex items-center justify-around flex-wrap gap-10 py-20 px-6 md:px-[12%]">
        <div className="flex flex-col">
          <h2 className="font-bold text-magent text-3xl md:text-4xl">
            Programa Oncoactívate
          </h2>
          <p className="text-xl font-medium max-w-lg mt-5">
            Somos una comunidad que proporciona un espacio seguro donde las
            pacientes pueden compartir sus experiencias, miedos, logros y
            desafíos. El simple acto de conectarse con otras personas que están
            pasando por situaciones similares puede brindar un apoyo emocional
            significativo y ayudar a las pacientes a sentirse menos solas en su
            lucha contra el cáncer de mama. Esto puede ser especialmente valioso
            en momentos de incertidumbre y ansiedad. Creemos que ver ejemplos de
            pacientes que llevan una vida activa durante y una vez terminado su
            tratamiento médico, puede ser una fuente poderosa de inspiración y
            motivación.
          </p>
        </div>
        <Image
          src={"/img/woman-section-landpage.jpg"}
          alt="Mujer ejercitandose"
          width={400}
          height={400}
          className="rounded-lg"
        />
      </section>
    </div>
  );
}
