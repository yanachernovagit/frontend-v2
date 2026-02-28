"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";

import { ArmCard } from "@/components/arm-volume/ArmCard";
import {
  ResultsPanel,
  type Results,
} from "@/components/arm-volume/ResultsPanel";
import { VideoPreview } from "@/components/shared/VideoPreview";
import { Button } from "@/components/ui/button";
import { useCommonUtils } from "@/hooks/useCommonUtils";
import {
  getPublicArmVolumeService,
  submitPublicArmVolumeService,
} from "@/services/publicArmVolumeService";

function parseResultNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = Number(value.replace(/,/g, "."));
    return Number.isFinite(normalized) ? normalized : 0;
  }
  return 0;
}

export default function VolumenBrazoPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (let i = 1; i <= 6; i++) {
      base[`left_${i}`] = "";
      base[`right_${i}`] = "";
    }
    return base;
  });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formatNumericValue } = useCommonUtils();

  useEffect(() => {
    getPublicArmVolumeService().then(({ videoUrl: url }) => {
      setVideoUrl(url);
    });
  }, []);

  const allArmInputsFilled = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6].every(
        (num) =>
          inputValues[`left_${num}`]?.trim().length > 0 &&
          inputValues[`right_${num}`]?.trim().length > 0,
      ),
    [inputValues],
  );

  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: formatNumericValue(value) }));
  };

  const handleSubmit = async () => {
    if (!allArmInputsFilled || isSubmitting) return;
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await submitPublicArmVolumeService(inputValues);
      setResults({
        difference: parseResultNumber(response.difference),
        leftVolume: parseResultNumber(response.leftVolume),
        rightVolume: parseResultNumber(response.rightVolume),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar resultados",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:px-[12%] py-20 bg-linear-to-r from-blue via-purple to-magent">
        <div className="flex flex-col gap-6 z-20 md:mt-8 flex-1">
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            ¿Por qué es importante conocer el volumen de nuestros brazos?
          </h1>
          <p className="text-white text-xl font-medium max-w-lg">
            En personas con diagnóstico de cáncer de mama que han intervenido en
            la axila con cirugía y/o radioterapia el sistema linfático puede
            verse afectado.
          </p>
          <p className="text-white text-xl font-medium max-w-lg">
            Esto puede provocar acumulación de líquido en el brazo, conocida
            como linfedema, que a veces aparece de forma lenta y progresiva.
          </p>
          <p className="text-white text-xl font-medium max-w-lg">
            El control periódico del volumen es una herramienta simple y útil
            para prevenir complicaciones o bien tratarlas a tiempo.
          </p>
          <p className="font-bold text-white text-2xl md:text-3xl mt-2">
            En Oncoactivate te enseñamos cómo hacerlo — ¡Ve el siguiente video!
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 flex-1 z-20 w-full md:max-w-xl">
          <div className="w-full overflow-hidden rounded-xl border border-white/20 shadow-lg">
            <div className="aspect-video w-full">
              <VideoPreview
                videoUrl={videoUrl}
                allowFullscreen
                muted
                className="h-full w-full"
                loadingBackgroundClassName="bg-blue/50"
              />
            </div>
          </div>
          <Button
            onClick={() =>
              document
                .getElementById("form-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center w-full h-14 text-2xl font-semibold gap-3 shadow"
          >
            Calcular volumen
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </Button>
        </div>

        <Image
          src="/brand/element-onocoactivate.svg"
          alt="Elemento decorativo Oncoactivate"
          fill
          className="absolute inset-0 object-cover z-10"
        />
      </section>

      <section
        id="form-section"
        className="relative w-full grid grid-cols-1 lg:grid-cols-2 items-start"
      >
        <div className="lg:hidden order-1 p-5">
          <Image
            src="/img-test/guia-volumen-brazo.jpeg"
            alt="Guía de puntos de medición del brazo"
            width={300}
            height={300}
            className="w-full object-cover"
          />
        </div>

        <div className="order-2 flex flex-col gap-5 p-6 md:px-10 md:py-12">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-magent text-3xl md:text-4xl">
              Calcula el volumen de tus brazos
            </h2>
            <p className="text-lg font-medium text-gray-500">
              Ingresa la circunferencia (cm) de cada punto en ambos brazos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ArmCard
              arm="left"
              inputValues={inputValues}
              focusedInput={focusedInput}
              onInputChange={handleInputChange}
              onFocus={setFocusedInput}
              onBlur={() => setFocusedInput(null)}
            />
            <ArmCard
              arm="right"
              inputValues={inputValues}
              focusedInput={focusedInput}
              onInputChange={handleInputChange}
              onFocus={setFocusedInput}
              onBlur={() => setFocusedInput(null)}
            />
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!allArmInputsFilled || isSubmitting}
              className="h-12 flex-1 bg-magent text-white hover:bg-magent/90 text-base font-bold rounded-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Calculando...
                </span>
              ) : (
                "Calcular volumen"
              )}
            </Button>
            <Button
              onClick={() => {
                const base: Record<string, string> = {};
                for (let i = 1; i <= 6; i++) {
                  base[`left_${i}`] = "";
                  base[`right_${i}`] = "";
                }
                setInputValues(base);
                setResults(null);
                setError(null);
              }}
              variant="outline_magent"
              className="h-12 px-6 rounded-xl"
            >
              Limpiar
            </Button>
          </div>

          <div className="lg:hidden">
            <ResultsPanel results={results} />
          </div>
        </div>

        <div className="hidden lg:flex flex-col p-5">
          <Image
            src="/img-test/guia-volumen-brazo.jpeg"
            alt="Guía de puntos de medición del brazo"
            width={300}
            height={300}
            className="w-full object-cover"
          />
          <div className="px-5 py-6">
            <ResultsPanel results={results} />
          </div>
        </div>
      </section>
    </div>
  );
}
