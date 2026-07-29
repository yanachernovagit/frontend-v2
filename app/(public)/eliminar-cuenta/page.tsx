import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Eliminar cuenta | Oncoactivate",
  description:
    "Cómo solicitar la eliminación de su cuenta de Oncoactivate y de todos los datos personales asociados.",
};

export default function EliminarCuenta() {
  return (
    <div className="flex flex-col w-full px-6 md:px-[15%] py-16 gap-8 text-black">
      <h1 className="text-3xl md:text-5xl font-bold text-magent">
        Eliminar su cuenta y sus datos
      </h1>

      <p className="md:text-xl">
        Esta página explica cómo solicitar la eliminación de su cuenta de{" "}
        <strong>Oncoactivate</strong> y de todos los datos personales asociados
        a ella. El procedimiento es gratuito y puede realizarlo en cualquier
        momento.
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          Opción 1: desde la aplicación
        </h2>
        <ol className="list-decimal pl-6 md:text-lg">
          <li>Abra Oncoactivate en su teléfono e inicie sesión.</li>
          <li>
            Vaya a la sección <strong>Perfil</strong>.
          </li>
          <li>
            Seleccione <strong>Eliminar cuenta</strong>.
          </li>
          <li>
            Confirme la operación. Se le pedirá confirmar dos veces, ya que es
            irreversible.
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          Opción 2: por correo electrónico
        </h2>
        <p className="md:text-lg">
          Si ya desinstaló la aplicación o no puede acceder a su cuenta,
          escríbanos a{" "}
          <a
            href="mailto:contacto@oncoactivate.com?subject=Eliminaci%C3%B3n%20de%20datos"
            className="font-bold text-magent underline"
          >
            contacto@oncoactivate.com
          </a>{" "}
          desde la dirección de correo con la que se registró, indicando en el
          asunto <strong>&ldquo;Eliminación de datos&rdquo;</strong>.
        </p>
        <p className="md:text-lg">
          Confirmaremos la recepción de su solicitud dentro de{" "}
          <strong>5 días hábiles</strong>.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          Qué datos se eliminan
        </h2>
        <p className="md:text-lg">
          En ambos casos eliminamos, dentro de un plazo máximo de{" "}
          <strong>30 días corridos</strong>:
        </p>
        <ul className="list-disc pl-6 md:text-lg">
          <li>Su cuenta y sus credenciales de acceso.</li>
          <li>
            Su correo electrónico, nombre, fecha de nacimiento, género y
            fotografía de perfil.
          </li>
          <li>
            Sus datos de salud: diagnóstico, tipo de tratamiento, antecedentes
            quirúrgicos y centro médico.
          </li>
          <li>
            Su historial de progreso, evaluaciones físicas, registros de fatiga
            y datos de pasos.
          </li>
          <li>
            Sus identificadores de notificaciones y los datos de analítica
            asociados a su cuenta.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          Qué datos se conservan
        </h2>
        <p className="md:text-lg">
          Únicamente conservamos información estadística{" "}
          <strong>previamente anonimizada de forma irreversible</strong>, que no
          permite identificarle y que ya no constituye un dato personal. No
          conservamos ninguna otra información suya.
        </p>
      </section>

      <section className="flex flex-col gap-4 pb-8">
        <h2 className="text-2xl font-bold text-magent">Más información</h2>
        <p className="md:text-lg">
          Puede consultar el detalle completo del tratamiento y los plazos de
          conservación en nuestra{" "}
          <Link
            href="/politica-de-privacidad"
            className="font-bold text-magent underline"
          >
            Política de Privacidad
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
