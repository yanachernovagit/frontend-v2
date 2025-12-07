import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-between gap-3 p-6 md:px-[12%] bg-linear-to-r from-blue via-purple to-magent">
        <div className="flex flex-col gap-5 md:gap-10 z-10 md:mt-24">
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Manual de ejercicio terapéutico
          </h1>
          <p className="text-white text-2xl font-medium max-w-lg">
            Descarga el nuevo manual de ejercicio 
            terapéutico para mujeres con diagnóstico 
            de cáncer de mama.
          </p>
          <Button className="w-fit px-16 py-5 text-xl">
            Ver
          </Button>
        </div>
        <Image
          src={"/education/manual-pdf.jpg"}
          alt="Icono Oncoactivate"
          width={350}
          height={100}
          className="shadow rounded-lg z-20"
        />
        <Image
          src={"/brand/element-onocoactivate.svg"}
          alt="Icono Oncoactivate"
          fill
          className="object-cover z-10"
        />
        
      </section>
      <section className="relative w-full flex flex-col md:flex-row items-center justify-between gap-10 p-6 md:pt-32 md:px-[10%]">
        <div className="flex flex-col">
          <h2 className="font-bold text-magent text-3xl md:text-4xl">
            Hablemos de cáncer
          </h2>
          <p className="text-xl font-medium max-w-lg mt-5">
            En oncoactivate entendemos que enfrentar un
            diagnóstico de cáncer de mama puede ser
            abrumador y desafiante en muchos aspectos.
            Es por eso que creemos firmemente en la
            importancia de formar una comunidad de apoyo
            sólida y comprensiva para todas las mujeres
            que están pasando por este proceso.
          </p>
        </div>
        <Image
          src={"/education/Cancer-mama.jpg"}
          alt="Mujer con lazo rosa"
          width={560}
          height={560}
          className="rounded-lg shadow"
        />
      </section>
      <section className="relative w-full flex flex-col items-center gap-10 p-6 md:pt-24 md:px-[10%]">
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-magent text-3xl md:text-4xl">
            ¿Qué es el Cáncer de Mama?
          </h2>
          <p className="text-xl font-medium">
            El cáncer de mama es una enfermedad en la cual las células de la mama se multiplican sin control y crecen de manera
            anormal, acumulándose para formar lo que llamamos un tumor. Existen distintos tipos de cáncer de mama.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-2xl md:text-3xl text-black-400">
            Tipos de Cáncer de Mama
          </h3>
          <p className="text-lg">
            Hay varios tipos de cáncer de mama, y se clasifican principalmente según el lugar donde comienzan y cómo se comportan
            biológicamente.
          </p>

          <h4 className="font-semibold text-lg md:text-xl mt-5">
            Según la ubicación se clasifican en:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Cáncer de mama ductal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Comienza en los conductos que llevan leche desde la glándula mamaria hasta el pezón. Es el tipo más común.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Cáncer de mama lobulillar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Comienza en las partes de las mamas, llamadas lobulillos, que producen la leche.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Cáncer inflamatorio de mama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Es menos común y se caracteriza por enrojecimiento e inflamación de la mama porque las células cancerosas bloquean
                  los vasos linfáticos.
                </p>
              </CardContent>
            </Card>
          </div>

          <h4 className="font-semibold text-lg md:text-xl mt-10">
            Según la biología de las células se clasifican en subtipos:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Luminal A | Receptor de hormonas positivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Este tipo de cáncer de mama es el más común. Las células cancerosas expresan receptores
                  hormonales para estrógeno y/o progesterona, pero tienen baja expresión de la proteína HER2.
                  Estos cánceres suelen crecer más lentamente y pueden tratarse con terapias hormonales.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Luminal B | Receptor de hormonas positivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Similar al Luminal A, este subtipo también expresa receptores de hormonas, pero con una
                  tasa de proliferación celular más alta y/o expresión positiva de HER2. Esto puede hacer
                  que este subtipo sea más agresivo que el Luminal A, y aunque también responde a
                  terapias hormonales, puede requerir combinaciones de tratamiento más intensas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  HER2 enriquecido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Este subtipo no expresa receptores de hormonas pero tiene una alta cantidad de la
                  proteína HER2 en la superficie de las células cancerosas. Es más agresivo y tiende a crecer
                  más rápidamente. Sin embargo, existen tratamientos específicos muy efectivos que se
                  dirigen a la proteína HER2.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Triple negativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Este subtipo no expresa receptores de estrógeno, progesterona ni HER2, lo que lo
                  hace más difícil de tratar con algunas de las terapias hormonales o dirigidas más comunes.
                  Los cánceres triple negativos tienden a ser más agresivos. El tratamiento principal para el
                  cáncer triple negativo es la quimioterapia.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="relative w-full flex flex-col items-center gap-10 p-6 md:py-24 md:px-[10%]">
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-magent text-3xl md:text-4xl">
            Etapas del Cáncer de Mama
          </h2>
          <p className="text-xl font-medium">
            El cáncer de mama se clasifica en etapas según su tamaño, si se ha propagado al sistema linfático o a otro órgano. Las
            etapas se numeran del 0 al 4:
          </p>
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Etapa 0
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Conocido como carcinoma in situ. Las células anormales están presentes pero no se han
                  diseminado a los tejidos circundantes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Etapa I
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Es un cáncer en su fase inicial, donde el tumor mide hasta 2 centímetros y no se ha extendido
                  fuera de la mama.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Etapa II
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  El tumor mide entre 2 y 5 centímetros, o se ha diseminado a los ganglios linfáticos cercanos.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Etapa III
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  El tumor es más grande o ha invadido tejidos cercanos, como la piel o los músculos de la pared torácica.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Etapa IV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  El cáncer se ha diseminado a otras partes del cuerpo, como los huesos, pulmones, hígado o cerebro.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="relative w-full flex flex-col items-center gap-10 p-6 md:py-16 md:px-[10%]">
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-magent text-3xl md:text-4xl">
            ¿Cuáles son los tratamientos para el cáncer?
          </h2>
          <p className="text-xl font-medium">
            El tratamiento médico depende de la etapa del cáncer y su biología. Habitualmente los pacientes tendrán una cirugía en la
            mama para extirpar el tumor y una cirugía en la axila para explorar los linfonodos cercanos. Algunos pacientes necesitaran
            de radioterapia, hormonoterapia, quimioterapia o terapia biológica. Los tratamientos son muy efectivos, pero no están libres
            de efectos secundarios. Te invitamos a conocer más acerca de cada uno de los tratamientos médicos que podrías recibir:
          </p>
        </div>

        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl md:text-2xl text-black-400">
              1. Cirugía en la mama
            </h3>
            <p className="text-lg">
              La cirugía es un tratamiento fundamental para el cáncer de mama, destinada a eliminar el tumor y prevenir su propagación.
              Dependiendo de la extensión del cáncer y de las preferencias del paciente, existen varios tipos de procedimientos
              quirúrgicos disponibles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-secondary flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  Mastectomía simple o total
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-base">
                  Esta cirugía implica la extirpación completa de una o ambas mamas, incluyendo el tejido
                  mamario, la piel y el complejo areola-pezón. Es una opción para casos de cáncer extenso o
                  cuando se busca reducir el riesgo de recurrencia.
                </p>
                <div className="mt-auto flex justify-center">
                  <Image
                    src="/education/masectomia/Masectomia.png"
                    alt="Ilustración mastectomía simple"
                    width={250}
                    height={250}
                    className="h-auto"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  Mastectomía modificada o conservadora de piel
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-base">
                  En esta intervención se extirpa el tejido mamario mientras se preserva la mayor parte de la
                  piel, y a veces el complejo areola-pezón, lo que facilita una reconstrucción mamaria más natural.
                </p>
                <div className="mt-auto flex justify-center">
                  <Image
                    src="/education/masectomia/Masectomia-1.png"
                    alt="Ilustración mastectomía modificada"
                    width={250}
                    height={250}
                    className="h-auto"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  Mastectomía radical modificada:
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-base">
                  Además de la extirpación de toda la mama, también se extraen algunos de los linfonodos axilares para
                  verificar si el cáncer se ha diseminado. Esta cirugía es menos común que la mastectomía simple y se usa
                  cuando hay una alta sospecha de invasión hacia el sistema linfático.
                </p>
                <div className="mt-auto flex justify-center">
                  <Image
                    src="/education/masectomia/Masectomia-3.png"
                    alt="Ilustración mastectomía radical"
                    width={250}
                    height={250}
                    className="h-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-secondary flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  Mastectomía radical:
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-base">
                  Es la más extensa, en la que se elimina toda la mama,
                  los linfonodos axilares y los músculos pectorales.
                  Se utiliza solo en casos donde el cáncer se ha diseminado
                  a estos músculos y en la actualidad es muy poco común.
                </p>
                <div className="mt-auto flex justify-center">
                  <Image
                    src="/education/masectomia/Masectomia-4.png"
                    alt="Ilustración mastectomía radical"
                    width={250}
                    height={250}
                    className="h-auto"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  Mastectomía parcial:
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-base">
                  Consiste en la extirpación del tumor junto
                  con un margen de tejido sano circundante.
                  Este método busca conservar tanto tejido
                  mamario como sea posible y es comúnmente
                  seguido por radioterapia.
                </p>
                <div className="mt-auto flex justify-center">
                  <Image
                    src="/education/masectomia/Masectomia-2.png"
                    alt="Ilustración mastectomía radical"
                    width={250}
                    height={250}
                    className="h-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Efectos adversos
              </h4>
              <p className="text-base text-justify">
                La cirugía de mama puede conllevar varios efectos secundarios, como dolor y
                sensibilidad en la zona operada, restricciones en la movilidad del brazo del lado operado, y
                en algunos casos, linfedema, especialmente si se han extraído varios linfonodos. La
                reconstrucción mamaria, ya sea inmediata o diferida, también puede llevar asociados
                otros riesgos quirúrgicos y estéticos.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Importancia clínica
              </h4>
              <p className="text-base text-justify">
                La elección del tipo de cirugía dependerá de varios factores, incluyendo el tamaño y la
                ubicación del tumor, si el cáncer se ha diseminado, consideraciones estéticas, y las
                preferencias del paciente. Esta decisión es crucial y debe tomarse en conjunto con un
                equipo médico especializado que evaluará cada caso de manera individual para
                determinar la mejor opción de tratamiento. Esta estrategia busca no solo eliminar el
                cáncer sino también mejorar la calidad de vida del paciente después del tratamiento.
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl md:text-2xl text-black-400">
              2. Cirugía en la axila
            </h3>
            <p className="text-lg">
              La cirugía axilar es un procedimiento clave en el manejo del cáncer de mama, especialmente cuando hay sospecha de que el
              cáncer se ha propagado al sistema linfático. Este tipo de cirugía ayuda a determinar la extensión del cáncer y a guiar las
              decisiones de tratamiento adicional. Descripción breve de los tipos de cirugía axilar:
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Card className="bg-secondary mt-6">
              <CardContent className="flex flex-col md:flex-row gap-6 p-6">
                <div className="flex-1 flex flex-col gap-4">
                  <h4 className="font-bold text-xl">
                    Biopsia del linfonodo centinela:
                  </h4>
                  <p className="text-base">
                    Este es el procedimiento menos invasivo para los ganglios linfáticos. Consiste en identificar y
                    extirpar el primer linfonodo (o linfonodos) al que el cáncer podría haberse diseminado desde
                    el tumor primario. Se utiliza un trazador radiactivo o un colorante para localizar el
                    linfonodo centinela. Si este linfonodo está libre de cáncer, es probable que los demás también
                    lo estén, lo que puede eliminar la necesidad de una disección más extensa.
                  </p>
                </div>
                <div className="flex items-center justify-center md:w-1/3">
                  <Image
                    src="/education/masectomia/Diseccion-1.png"
                    alt="Biopsia del linfonodo centinela"
                    width={300}
                    height={300}
                    className="h-auto"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary mt-6">
              <CardContent className="flex flex-col md:flex-row gap-6 p-6">
                <div className="flex-1 flex flex-col gap-4">
                  <h4 className="font-bold text-xl">
                    Disección de linfonodos axilares:
                  </h4>
                  <p className="text-base">
                    Si la biopsia del linfonodo centinela muestra cáncer, 
                    o si hay una alta sospecha de diseminación más amplia, 
                    se realiza una disección axilar. Este procedimiento 
                    implica la extirpación de muchos linfonodos en la 
                    axila para evaluarlos y determinar la presencia de 
                    células cancerosas. Esto proporciona información vital 
                    sobre el estadio del cáncer y puede influir en la decisión 
                    de realizar tratamientos adicionales como la quimioterapia 
                    o la radioterapia.
                  </p>
                </div>
                <div className="flex items-center justify-center md:w-1/3">
                  <Image
                    src="/education/masectomia/Diseccion-2.png"
                    alt="Biopsia del linfonodo centinela"
                    width={300}
                    height={300}
                    className="h-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Efectos adversos
              </h4>

              <div className="flex flex-col gap-3">
                <div>
                  <h5 className="font-semibold text-base mb-1">1. Dolor y sensibilidad</h5>
                  <p className="text-base">
                    La cirugía puede causar dolor y sensibilidad en la zona tratada.
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-base mb-1">2. Reducción de la movilidad del brazo</h5>
                  <p className="text-base">
                    Puede haber una limitación temporal o permanente en la movilidad del brazo del lado operado, afectando la
                    realización de actividades cotidianas.
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-base mb-1">3. Linfedema</h5>
                  <p className="text-base">
                    Es una preocupación significativa, especialmente después de la disección extensa de los linfonodos. El
                    linfedema es la acumulación de líquido linfático en los tejidos blandos, lo que causa inflamación. Puede ser
                    crónico y requerir manejo a largo plazo.
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-base mb-1">4. Adormecimiento en la axila y cara interna del brazo:</h5>
                  <p className="text-base">
                    los nervios en la región axilar pueden ser afectados durante la cirugía, lo que puede causar una pérdida
                    temporal o permanente de sensación en el área.
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-base mb-1">5. Síndrome de red axilar:</h5>
                  <p className="text-base">
                    Se caracteriza por la formación de una red de tejido cicatricial denso, desde la axila, la cara interna del brazo
                    pudiendo llegar hasta la muñeca, que puede causar dolor persistente, rigidez y problemas de movilidad en el área
                    afectada.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Importancia clínica
              </h4>
              <p className="text-base text-justify">
                La cirugía axilar es crucial para la evaluación precisa del cáncer de mama. Los resultados
                de estos procedimientos ayudan a determinar la necesidad de tratamientos adicionales y a planificar la mejor estrategia
                para cada caso. La decisión de realizar una biopsia del linfonodo centinela o una
                disección axilar depende de varios factores, incluyendo el tamaño del tumor, la
                localización, los resultados de otras pruebas y, en algunos casos, las preferencias del
                paciente. Estos procedimientos ayudan a garantizar que el plan de tratamiento sea lo
                más dirigido y efectivo posible, con el objetivo de mejorar los resultados a largo plazo para
                el paciente.
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl md:text-2xl text-black-400">
              3. Radioterapia
            </h3>
            <p className="text-lg">
              La radioterapia utiliza radiación de alta energía para destruir células cancerosas en la mama y reducir el riesgo de recurrencia
              del cáncer. Este tratamiento se dirige específicamente a las áreas afectadas, preservando en lo posible los tejidos sanos
              circundantes.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-lg md:text-xl">
              Descripción breve
            </h4>
            <p className="text-base">
              Durante la radioterapia, se utilizan haces de radiación focalizados que se aplican directamente al área de la mama donde se
              encontraba el tumor o en todo el pecho, dependiendo de la cirugía realizada y la extensión del cáncer. La radioterapia
              también puede incluir el tratamiento de los linfonodos cercanos para prevenir la diseminación del cáncer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Efectos secundarios
              </h4>
              <p className="text-base text-justify">
                Los efectos secundarios comunes de la radioterapia incluyen fatiga, que puede limitar
                las actividades cotidianas de los pacientes. La piel en la zona tratada también puede
                mostrar signos de quemaduras como enrojecimiento y sensibilidad. Además, se
                asocia a riesgo de linfedema, especialmente cuando los linfonodos de la axila son
                irradiados, lo que puede resultar en aumento de volumen del brazo del mismo lado.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Importancia clínica
              </h4>
              <p className="text-base text-justify">
                La radioterapia es fundamental para el manejo del cáncer de mama, especialmente
                después de la cirugía conservadora de mama para eliminar cualquier resto de células
                cancerosas. También se utiliza para reducir el tamaño de los tumores grandes antes de la
                cirugía y en casos de cáncer avanzado para aliviar los síntomas.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-5" />

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-xl md:text-2xl text-black-400">
            4. Quimioterapia
          </h3>
          <p className="text-lg">
            La quimioterapia puede ser administrada de manera intravenosa (directamente en la vena) o en forma de pastillas. Estos
            medicamentos viajan por el cuerpo, atacando a las células que crecen rápidamente, como las células cancerosas, pero
            también pueden afectar a células sanas que crecen rápidamente, como las del cabello, del revestimiento del estómago y de
            las mucosas en general.
          </p>

          <h4 className="font-semibold text-lg md:text-xl mt-4">
            Descripción breve
          </h4>
          <p className="text-base">
            La quimioterapia puede ser administrada de manera intravenosa (directamente en la vena) o en forma de pastillas. Estos
            medicamentos viajan por el cuerpo, atacando a las células que crecen rápidamente, como las células cancerosas, pero
            también pueden afectar a células sanas que crecen rápidamente, como las del cabello, del revestimiento del estómago y de
            las mucosas en general.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Efectos secundarios
              </h4>
              <p className="text-base text-justify">
                Los efectos secundarios de la quimioterapia pueden ser significativos, incluyendo
                náuseas, vómitos, pérdida del apetito, pérdida de cabello, y cambios en la
                percepción del gusto. También puede causar fatiga severa, afectando la capacidad del
                paciente para realizar actividades diarias. A largo plazo, puede impactar en la masa
                muscular y la coordinación-equilibrio.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Importancia clínica
              </h4>
              <p className="text-base text-justify">
                La quimioterapia es crucial para tratar varios tipos de cáncer de mama, especialmente
                aquellos que son agresivos o se han diseminado. Es una parte integral del
                tratamiento adyuvante para eliminar cualquier célula cancerosa que pueda haber
                quedado después de la cirugía y para tratar el cáncer avanzado, mejorando la calidad de
                vida y prolongando la supervivencia.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-5" />

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-xl md:text-2xl text-black-400">
            5. Hormonoterapia
          </h3>
          <p className="text-lg">
            La hormonoterapia es un tratamiento que se utiliza en cánceres de mama que son positivos para receptores hormonales, es
            decir, aquellos cánceres que crecen en respuesta a las hormonas estrógeno o progesterona. Este tratamiento ayuda a
            bloquear la capacidad del cuerpo para producir estas hormonas o interfiere con la función de ellas, deteniendo así o
            ralentizando el crecimiento de las células cancerosas.
          </p>

          <h4 className="font-semibold text-lg md:text-xl mt-4">
            Descripción breve
          </h4>
          <p className="text-base">
            La hormonoterapia puede administrarse en forma de pastillas, como el tamoxifeno, o mediante inyecciones que suprimen la
            producción de estrógeno en los ovarios. También existen medicamentos llamados inhibidores de la aromatasa, que se
            utilizan principalmente en mujeres postmenopáusicas para reducir la cantidad de estrógeno producido en el cuerpo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Efectos secundarios
              </h4>
              <p className="text-base text-justify">
                Aunque es menos tóxica que la quimioterapia, la hormonoterapia puede tener efectos
                secundarios, incluyendo bochornos, riesgo aumentado de trombosis, fatiga, cambios en
                el estado de ánimo, y menopausia inducida. Además, en algunos casos puede causar
                debilitamiento óseo (osteoporosis).
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-xl text-black-400">
                Importancia clínica
              </h4>
              <p className="text-base text-justify">
                La hormonoterapia es crucial para mejorar la supervivencia en pacientes con cáncer de
                mama hormono-positivo, y puede ser usada tanto en el contexto adyuvante (después de
                otros tratamientos para reducir la posibilidad de recurrencia del cáncer) como en el
                tratamiento de cánceres en etapa IV o metastásicos.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative w-full flex flex-col md:flex-row items-center gap-10 p-6 md:py-20 md:px-[12%]">
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-magent text-3xl md:text-4xl">
              ¿Qué es la terapia física?
            </h2>
            <p className="text-lg">
              Es un campo de la salud que se enfoca en prevenir, evaluar y tratar efectos adversos
              relacionados con el movimiento y la función del cuerpo, utilizando técnicas y ejercicios. El
              objetivo principal es mejorar la calidad de vida.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl md:text-2xl text-black-400">
              ¿Cómo se relaciona la terapia física y el cáncer?
            </h3>
            <p className="text-base">
              Antes, durante y una vez finalizados los tratamientos médicos para el cáncer, la terapia
              física desempeña un papel clave en la prevención y recuperación, aliviando efectos
              secundarios como debilidad y fatiga, y mejorando la movilidad. Además, ayuda a
              controlar síntomas como el dolor, previene complicaciones como el linfedema, y contribuye
              al bienestar general de los pacientes.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/education/Linfedema-ejercicio.jpg"
            alt="Mujer haciendo terapia física"
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
      </section>
      <section className="relative w-full flex flex-col items-center gap-10 md:py-20 p-6">
        <h2 className="font-bold text-magent text-3xl md:text-4xl">
          Glosario
        </h2>

        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            <div className="font-bold text-xl hidden md:block">Palabra</div>
            <div className="font-bold text-xl hidden md:block">Descripción</div>

            <div className="font-semibold text-base">
              Carcinoma ductal invasivo (CDI)
            </div>
            <div className="text-base">
              Se origina en los conductos de la glándula mamaria y puede extenderse a tejidos cercanos. Es el más
              común, representando alrededor del 80% de los casos.
            </div>

            <div className="font-semibold text-base">
              Carcinoma lobulillar invasivo (CLI)
            </div>
            <div className="text-base">
              Empieza en los lobulillos de la mama y puede diseminarse. Constituye alrededor del 10% de los casos.
            </div>

            <div className="font-semibold text-base">
              Carcinoma ductal in situ (CDIS)
            </div>
            <div className="text-base">
              Las células cancerosas están en los conductos, sin invadir tejidos cercanos. Es considerado premaligno y,
              si no se trata, puede volverse invasivo.
            </div>

            <div className="font-semibold text-base">
              Carcinoma lobulillar in situ (CLIS)
            </div>
            <div className="text-base">
              Las células anormales se originan en los lobulillos, pero no han invadido tejidos cercanos. A menudo se
              considera un pre cáncer.
            </div>

            <div className="font-semibold text-base">
              Cáncer de mama inflamatorio
            </div>
            <div className="text-base">
              Es un cáncer agresivo, la piel se ve enrojecida y abultada. Son alrededor del 1-3% de los casos de cáncer
              de mama.
            </div>

            <div className="font-semibold text-base">
              Cáncer de mama metastásico
            </div>
            <div className="text-base">
              El cáncer se ha propagado a otras partes del cuerpo, como huesos, hígado, pulmones o cerebro. Es una
              etapa avanzada y requiere un tratamiento específico.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}