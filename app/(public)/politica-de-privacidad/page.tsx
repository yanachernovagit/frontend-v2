import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Oncoactivate",
  description:
    "Cómo Oncoactivate recopila, utiliza, conserva y elimina los datos personales y de salud de sus usuarios.",
};

// Fecha real de la última modificación del documento. Se actualiza a mano al
// editar el contenido, para que la página no diga "actualizada hoy" cuando el
// texto no cambió.
const ULTIMA_ACTUALIZACION = "28-07-2026";

export default function PoliticaDePrivacidad() {
  return (
    <div className="flex flex-col w-full px-6 md:px-[15%] py-16 gap-8 text-black">
      <h1 className="text-3xl md:text-5xl font-bold text-magent">
        Política de Privacidad
      </h1>

      <p className="md:text-xl">
        <strong>Fecha de última actualización:</strong> {ULTIMA_ACTUALIZACION}
      </p>

      <p className="md:text-xl">
        La presente Política de Privacidad describe cómo{" "}
        <strong>Oncoactivate</strong> (en adelante, &ldquo;la Aplicación&rdquo;
        o &ldquo;Nosotros&rdquo;) recopila, utiliza, almacena, conserva,
        elimina, protege y comparte la información personal de sus usuarios (en
        adelante, &ldquo;Usted&rdquo; o &ldquo;Usuario&rdquo;) en la República
        de Chile. Al acceder o utilizar la Aplicación, Usted acepta las
        prácticas descritas en esta política.
      </p>

      <p className="md:text-xl">
        Oncoactivate es una aplicación de apoyo a la rehabilitación y actividad
        física para personas en tratamiento oncológico. Para cumplir esa
        finalidad tratamos{" "}
        <strong>datos personales sensibles relativos a la salud</strong>. Lea
        con atención las secciones 2, 7 y 8.
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">1. Marco Legal</h2>
        <p className="md:text-lg">
          Esta Política de Privacidad se rige por la legislación chilena vigente
          en materia de protección de datos personales, incluyendo:
        </p>
        <ul className="list-disc pl-6 md:text-lg">
          <li>Ley N° 19.628 sobre Protección de la Vida Privada.</li>
          <li>Ley N° 20.584 sobre Derechos y Deberes del Paciente.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          2. Información que Recopilamos
        </h2>
        <p className="md:text-lg">
          Recopilamos únicamente la información necesaria para prestar el
          servicio. A continuación detallamos, por categoría, qué datos
          tratamos:
        </p>

        <h3 className="text-xl font-bold mt-2">2.1 Datos de cuenta</h3>
        <ul className="list-disc pl-6 md:text-lg">
          <li>
            <strong>Correo electrónico:</strong> necesario para crear su cuenta,
            iniciar sesión y recibir comunicaciones técnicas.
          </li>
          <li>
            <strong>Nombre completo:</strong> para personalizar la aplicación y
            sus reportes.
          </li>
          <li>
            <strong>Contraseña:</strong> almacenada de forma cifrada. Nunca
            tenemos acceso a su contraseña en texto plano.
          </li>
          <li>
            <strong>Fotografía de perfil (opcional):</strong> si Usted decide
            cargarla desde su cámara o galería.
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-2">
          2.2 Datos personales sensibles de salud
        </h3>
        <p className="md:text-lg">
          Durante el registro y el uso de la Aplicación le solicitamos la
          siguiente información, que constituye <strong>dato sensible</strong>{" "}
          conforme al artículo 2° letra g) de la Ley N° 19.628:
        </p>
        <ul className="list-disc pl-6 md:text-lg">
          <li>
            <strong>Diagnóstico médico.</strong>
          </li>
          <li>
            <strong>Tipo de tratamiento oncológico</strong> en curso.
          </li>
          <li>
            <strong>Antecedentes quirúrgicos</strong>, incluyendo si se le
            realizó cirugía mamaria y de qué tipo.
          </li>
          <li>
            <strong>Centro médico</strong> donde se atiende (opcional).
          </li>
          <li>
            <strong>Fecha de nacimiento</strong> y <strong>género</strong>.
          </li>
          <li>
            <strong>Peso y estatura</strong> (opcionales).
          </li>
          <li>
            <strong>Nivel de actividad física</strong> previo y motivos
            asociados.
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-2">
          2.3 Datos generados por el uso de la Aplicación
        </h3>
        <ul className="list-disc pl-6 md:text-lg">
          <li>
            <strong>Progreso en rutinas y ejercicios</strong> completados.
          </li>
          <li>
            <strong>Evaluaciones físicas</strong> y sus resultados.
          </li>
          <li>
            <strong>Niveles de fatiga</strong> reportados por Usted.
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-2">
          2.4 Datos de actividad física (Health Connect y Apple Salud)
        </h3>
        <p className="md:text-lg">
          Con su autorización expresa, la Aplicación lee su{" "}
          <strong>conteo diario de pasos</strong> desde{" "}
          <strong>Health Connect</strong> en dispositivos Android y desde{" "}
          <strong>Apple Salud (HealthKit)</strong> en dispositivos iOS. Sobre
          estos datos:
        </p>
        <ul className="list-disc pl-6 md:text-lg">
          <li>
            Se utilizan exclusivamente para mostrarle su progreso y ajustar su
            plan de ejercicios.
          </li>
          <li>
            <strong>No se comparten con terceros</strong> bajo ninguna
            circunstancia.
          </li>
          <li>
            <strong>No se utilizan con fines publicitarios</strong> ni de
            elaboración de perfiles comerciales.
          </li>
          <li>
            Usted puede revocar este permiso en cualquier momento desde Health
            Connect o Apple Salud, sin que ello impida seguir usando el resto de
            la Aplicación.
          </li>
          <li>
            Si revoca el permiso, dejamos de leer nuevos datos de inmediato y
            puede solicitar la eliminación de los ya almacenados según la
            sección 8.
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-2">
          2.5 Datos técnicos y de diagnóstico
        </h3>
        <ul className="list-disc pl-6 md:text-lg">
          <li>
            <strong>Identificador de dispositivo para notificaciones</strong>{" "}
            (token push), si Usted acepta recibirlas.
          </li>
          <li>
            <strong>
              Modelo de dispositivo, sistema operativo, versión de la
              Aplicación, idioma y región.
            </strong>
          </li>
          <li>
            <strong>Estadísticas de uso y reportes de errores</strong>,
            procesados por PostHog, nuestro proveedor de analítica. A este
            proveedor se le envía un{" "}
            <strong>identificador seudonimizado</strong>: no recibe su nombre,
            su correo electrónico, su fecha de nacimiento ni sus datos de salud.
          </li>
          <li>
            <strong>Grabaciones de sesión enmascaradas</strong> de una muestra
            reducida de sesiones (aproximadamente el 10%), destinadas
            exclusivamente a detectar errores de uso. En estas grabaciones{" "}
            <strong>
              todo texto ingresado y todas las imágenes se enmascaran
              automáticamente antes de salir de su dispositivo
            </strong>
            , por lo que no es posible leer en ellas datos personales ni de
            salud.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          3. Finalidad de la Recopilación de Datos
        </h2>
        <p className="md:text-lg">Utilizamos su información únicamente para:</p>
        <ul className="list-disc pl-6 md:text-lg">
          <li>
            Proveer y mejorar los servicios de rehabilitación y actividad
            física.
          </li>
          <li>
            Personalizar su plan de ejercicios según su diagnóstico, tratamiento
            y condición física.
          </li>
          <li>
            Realizar seguimiento de su progreso y mostrarle sus resultados.
          </li>
          <li>
            Enviarle recordatorios y notificaciones, si Usted las ha autorizado.
          </li>
          <li>Detectar y corregir errores técnicos de la Aplicación.</li>
          <li>
            Elaborar estadísticas <strong>anonimizadas</strong> con fines de
            investigación académica.
          </li>
        </ul>
        <p className="md:text-lg">
          <strong>No vendemos su información personal</strong> ni la utilizamos
          con fines publicitarios o de mercadeo.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">4. Consentimiento</h2>
        <p className="md:text-lg">
          Al registrarse y utilizar Oncoactivate, Usted otorga su consentimiento
          libre, informado y expreso para el tratamiento de sus datos personales
          y de sus datos sensibles de salud, de acuerdo con esta política. Puede
          revocar este consentimiento en cualquier momento eliminando su cuenta
          conforme a la sección 8.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          5. Compartir Información
        </h2>
        <p className="md:text-lg">
          No compartimos su información personal con terceros, salvo en los
          siguientes casos:
        </p>
        <ul className="list-disc pl-6 md:text-lg">
          <li>Con su consentimiento explícito.</li>
          <li>Por requerimiento legal de autoridad competente.</li>
          <li>
            De forma <strong>anonimizada e irreversible</strong>, para fines de
            investigación académica.
          </li>
          <li>
            Con los proveedores de infraestructura estrictamente necesarios para
            operar el servicio, que actúan como encargados de tratamiento y
            están obligados contractualmente a la confidencialidad: alojamiento
            de datos y autenticación (Supabase), almacenamiento de archivos
            multimedia (Amazon Web Services), analítica y reporte de errores
            (PostHog) y envío de notificaciones (Expo y Google Firebase).
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">6. Seguridad</h2>
        <p className="md:text-lg">
          Implementamos medidas de seguridad técnicas y organizativas para
          proteger sus datos contra acceso no autorizado, pérdida o alteración.
          Entre ellas: cifrado de las comunicaciones mediante HTTPS, cifrado de
          las contraseñas, control de acceso por roles y registro de accesos
          administrativos.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          7. Conservación de los Datos
        </h2>
        <p className="md:text-lg">
          Conservamos su información solo durante el tiempo necesario para
          cumplir las finalidades descritas en esta política. Los plazos de
          conservación son los siguientes:
        </p>
        <ul className="list-disc pl-6 md:text-lg">
          <li>
            <strong>Datos de cuenta y perfil</strong> (correo, nombre,
            fotografía): mientras su cuenta permanezca activa.
          </li>
          <li>
            <strong>Datos sensibles de salud</strong> (diagnóstico, tratamiento,
            antecedentes quirúrgicos): mientras su cuenta permanezca activa.
          </li>
          <li>
            <strong>Datos de progreso, evaluaciones, fatiga y pasos</strong>:
            mientras su cuenta permanezca activa.
          </li>
          <li>
            <strong>Cuentas inactivas</strong>: si no registra actividad durante{" "}
            <strong>24 meses consecutivos</strong>, eliminamos o anonimizamos su
            información de forma automática.
          </li>
          <li>
            <strong>Identificadores de notificaciones</strong> (token push):
            hasta que Usted desactive las notificaciones o elimine la
            Aplicación.
          </li>
          <li>
            <strong>Datos técnicos y de diagnóstico</strong> (analítica,
            reportes de error, grabaciones de sesión enmascaradas): un máximo de{" "}
            <strong>12 meses</strong>, tras los cuales se eliminan
            automáticamente.
          </li>
          <li>
            <strong>Tras una solicitud de eliminación</strong>: eliminamos sus
            datos dentro de un plazo máximo de <strong>30 días corridos</strong>
            , conforme a la sección 8.
          </li>
          <li>
            <strong>
              Datos anonimizados con fines estadísticos o de investigación
            </strong>
            : se conservan de forma indefinida. Estos datos han sido disociados
            de forma irreversible de su identidad y, por lo tanto, ya no
            constituyen datos personales ni permiten identificarle.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          8. Eliminación de su Cuenta y sus Datos
        </h2>
        <p className="md:text-lg">
          Usted puede solicitar en cualquier momento la{" "}
          <strong>
            eliminación de su cuenta y de todos sus datos personales
          </strong>
          . Existen dos vías, ambas gratuitas:
        </p>

        <h3 className="text-xl font-bold mt-2">8.1 Desde la Aplicación</h3>
        <ol className="list-decimal pl-6 md:text-lg">
          <li>Abra Oncoactivate e inicie sesión.</li>
          <li>
            Vaya a <strong>Perfil</strong>.
          </li>
          <li>
            Seleccione <strong>Eliminar cuenta</strong>.
          </li>
          <li>
            Confirme la operación. Se le pedirá confirmar dos veces, ya que la
            acción es irreversible.
          </li>
        </ol>

        <h3 className="text-xl font-bold mt-2">8.2 Por correo electrónico</h3>
        <p className="md:text-lg">
          Si no puede acceder a la Aplicación, escríbanos a{" "}
          <strong>contacto@oncoactivate.com</strong> desde la dirección de
          correo con la que se registró, indicando en el asunto{" "}
          <strong>&ldquo;Eliminación de datos&rdquo;</strong>. Confirmaremos la
          recepción de su solicitud dentro de <strong>5 días hábiles</strong>.
        </p>

        <h3 className="text-xl font-bold mt-2">8.3 Qué se elimina</h3>
        <p className="md:text-lg">
          En ambos casos eliminamos, dentro de un plazo máximo de{" "}
          <strong>30 días corridos</strong>:
        </p>
        <ul className="list-disc pl-6 md:text-lg">
          <li>Su cuenta y credenciales de acceso.</li>
          <li>
            Su correo electrónico, nombre, fecha de nacimiento, género y
            fotografía de perfil.
          </li>
          <li>
            Todos sus datos sensibles de salud: diagnóstico, tratamiento,
            antecedentes quirúrgicos y centro médico.
          </li>
          <li>
            Su historial de progreso, evaluaciones físicas, registros de fatiga
            y datos de pasos.
          </li>
          <li>
            Sus identificadores de notificaciones y sus datos de analítica
            asociados.
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-2">8.4 Qué se conserva</h3>
        <p className="md:text-lg">
          Únicamente conservamos, tras la eliminación, la información
          estadística{" "}
          <strong>previamente anonimizada de forma irreversible</strong>, que no
          permite identificarle y que ya no constituye un dato personal. No
          conservamos ninguna otra información suya.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">9. Sus Derechos</h2>
        <p className="md:text-lg">
          Conforme a la Ley N° 19.628, Usted tiene derecho a{" "}
          <strong>acceder</strong> a sus datos, <strong>rectificarlos</strong>{" "}
          si son inexactos, <strong>eliminarlos</strong> y{" "}
          <strong>oponerse</strong> a su tratamiento. Para ejercer cualquiera de
          estos derechos, escríbanos a{" "}
          <strong>contacto@oncoactivate.com</strong>. Responderemos su solicitud
          dentro de <strong>5 días hábiles</strong>. Para la eliminación, siga
          el procedimiento descrito en la sección 8.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">10. Menores de Edad</h2>
        <p className="md:text-lg">
          Oncoactivate está dirigida a personas mayores de 18 años. No
          recopilamos deliberadamente información de menores de edad. Si
          detectamos que hemos recibido datos de un menor sin la autorización de
          su representante legal, los eliminaremos.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-magent">
          11. Cambios a esta Política
        </h2>
        <p className="md:text-lg">
          Podemos actualizar esta Política de Privacidad. Cuando lo hagamos,
          modificaremos la fecha de última actualización que aparece al inicio
          de este documento. Si los cambios son sustanciales, se lo
          comunicaremos a través de la Aplicación o por correo electrónico.
        </p>
      </section>

      <section className="flex flex-col gap-4 pb-8">
        <h2 className="text-2xl font-bold text-magent">12. Contacto</h2>
        <p className="md:text-lg">
          Si tiene dudas sobre esta política o sobre el tratamiento de sus
          datos, puede contactarnos en{" "}
          <strong>contacto@oncoactivate.com</strong>.
        </p>
      </section>
    </div>
  );
}
