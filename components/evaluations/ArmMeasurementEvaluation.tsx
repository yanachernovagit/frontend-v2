"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Evaluation } from "@/types";
import { useCommonUtils } from "@/hooks/useCommonUtils";
import { ArmVolumeInput } from "./ArmVolumeInput";
import { VideoPreview } from "../shared";

type Props = {
  evaluation: Evaluation;
  onComplete: (results: Record<string, string>) => Promise<void>;
  completedResults?: Record<string, any> | null;
};

type HealthStatus = {
  color: string;
  bgClass: string;
  borderClass: string;
  icon: React.ReactNode;
  message: string;
  description: string;
};

export function ArmMeasurementEvaluation({
  evaluation,
  onComplete,
  completedResults,
}: Props) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [showVolumeInputs, setShowVolumeInputs] = useState(false);
  const { formatDisplayNumber } = useCommonUtils();

  /* =========================
      HEALTH STATUS
  ========================== */
  const getHealthStatus = (difference: number): HealthStatus => {
    if (difference <= 150) {
      return {
        color: "#10B981",
        bgClass: "bg-green-50",
        borderClass: "border-green-500",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        message: "Normalidad",
        description: "0-150 ml: normalidad",
      };
    }

    if (difference <= 200) {
      return {
        color: "#F59E0B",
        bgClass: "bg-yellow-50",
        borderClass: "border-yellow-500",
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        message: "Se sugiere consultar con kinesiólogo",
        description: ">150 ml: se sugiere consultar con kinesiólogo",
      };
    }

    return {
      color: "#EF4444",
      bgClass: "bg-red-50",
      borderClass: "border-red-500",
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      message: "Consultar de forma precoz con kinesiólogo",
      description: ">200 ml: consultar de forma precoz con kinesiólogo",
    };
  };

  useEffect(() => {
    const baseInputs: Record<string, string> = {};
    for (let i = 1; i <= 6; i++) {
      baseInputs[`left_${i}`] = "";
      baseInputs[`right_${i}`] = "";
    }
    setInputValues(baseInputs);
  }, [evaluation]);

  const allArmInputsFilled = [1, 2, 3, 4, 5, 6].every((point) => {
    return (
      inputValues[`left_${point}`]?.trim().length > 0 &&
      inputValues[`right_${point}`]?.trim().length > 0
    );
  });

  const handleSubmit = async () => {
    if (!allArmInputsFilled) return;
    await onComplete(inputValues);
  };

  const renderVideoPreview = () => {
    if (!evaluation.videoUrl) return null;

    return (
      <div className="w-full">
        <div className="w-full h-80 rounded-2xl overflow-hidden border bg-black">
          <VideoPreview
            videoUrl={evaluation.videoUrl}
            allowFullscreen={true}
            muted={true}
            className="w-full h-full"
            loadingBackgroundClassName="bg-purple-400"
          />
        </div>
      </div>
    );
  };
  if (completedResults) {
    const status = getHealthStatus(Number(completedResults.difference));

    return (
      <Card className="h-full rounded-2xl border-gray-200 p-4">
        <CardContent className="p-0 space-y-3 h-full overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-purple-100">
              <Image
                src={evaluation.logoUrl}
                alt={evaluation.name}
                width={36}
                height={36}
                className="w-[65%] h-[65%]"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {evaluation.name}
              </h2>
            </div>
          </div>
          {renderVideoPreview()}

          {evaluation.howToDo && (
            <p className="text-xl text-gray-700 text-center leading-6">
              {evaluation.howToDo}
            </p>
          )}

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Resultados Registrados
              </h3>
            </div>

            {/* DIFFERENCE */}
            <div
              className={`
                ${status.bgClass}
                ${status.borderClass}
                border-2 rounded-xl p-4 mb-4
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {status.icon}
                  <span className="font-bold" style={{ color: status.color }}>
                    Diferencia
                  </span>
                </div>

                <span
                  className="text-2xl font-bold"
                  style={{ color: status.color }}
                >
                  {formatDisplayNumber(Number(completedResults.difference))} ml
                </span>
              </div>

              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: `${status.color}20` }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: status.color }}
                >
                  {status.message}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {status.description}
                </p>
              </div>
            </div>

            {/* VOLUMES */}
            <div className="grid gap-3">
              <div className="rounded-xl border bg-white p-4">
                <p className="font-semibold mb-2">Volumen Brazo Izquierdo</p>
                <p className="text-2xl font-bold text-purple">
                  {formatDisplayNumber(Number(completedResults.leftVolume))} ml
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4">
                <p className="font-semibold mb-2">Volumen Brazo Derecho</p>
                <p className="text-2xl font-bold text-purple">
                  {formatDisplayNumber(Number(completedResults.rightVolume))} ml
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showVolumeInputs) {
    return (
      <Card className="h-full rounded-2xl border-gray-200 p-4">
        <CardContent className="p-0 space-y-6 h-full flex flex-col">
          <div className="max-h-[65vh] overflow-y-auto">
            <ArmVolumeInput
              inputValues={inputValues}
              onInputChange={(key, value) =>
                setInputValues((prev) => ({ ...prev, [key]: value }))
              }
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!allArmInputsFilled}
            className="w-full h-14 bg-purple text-white text-lg font-bold disabled:bg-gray-400"
          >
            Enviar resultados
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-2xl border-gray-200 p-4">
      <CardContent className="flex flex-col justify-between gap-3 p-0 h-full">
        <div className="flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-purple-100">
              <Image
                src={evaluation.logoUrl}
                alt={evaluation.name}
                width={36}
                height={36}
                className="w-[65%] h-[65%]"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {evaluation.name}
              </h2>
            </div>
          </div>

          {renderVideoPreview()}

          {evaluation.howToDo && (
            <p className="text-xl text-gray-700 text-center leading-6">
              {evaluation.howToDo}
            </p>
          )}
        </div>

        <Button
          onClick={() => setShowVolumeInputs(true)}
          className="w-full h-14 bg-purple text-white text-lg font-bold"
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
}
