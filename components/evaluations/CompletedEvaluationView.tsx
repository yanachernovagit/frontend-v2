"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, XCircle, Timer } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import TaskMagentIcon from "@/public/icons/magent/Task-magent.svg";

import type { CompletedUserEvaluation, Evaluation } from "@/types";
import { useCommonUtils } from "@/hooks/useCommonUtils";
import { EvaluationTypeEnum } from "@/constants/enums";

interface CompletedEvaluationViewProps {
  results: CompletedUserEvaluation;
  evaluation: Evaluation;
}

type HealthStatus = {
  color: string;
  bgClass: string;
  borderClass: string;
  icon: React.ReactNode;
  message: string;
  description: string;
};

export function CompletedEvaluationView({
  results,
  evaluation,
}: CompletedEvaluationViewProps) {
  const router = useRouter();
  const { formatDisplayNumber } = useCommonUtils();

  const isTimeType = evaluation.type === EvaluationTypeEnum.TIME;

  const getResultLabel = (key: string): { label: string; unit: string } => {
    const expectedResult = evaluation.expectedResults[key];

    return {
      label: expectedResult ?? key.replace(/_/g, " "),
      unit: isTimeType ? "" : "ml",
    };
  };

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

  const hasArmVolumes =
    !isTimeType &&
    results.results.leftVolume !== undefined &&
    results.results.rightVolume !== undefined;
  return (
    <div className="bg-white rounded-t-3xl flex-1">
      <Card className="rounded-3xl border-gray-200 h-full p-4">
        <CardContent className="p-0 flex flex-col justify-between h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col items-center mb-6 text-center">
              <Image
                src={TaskMagentIcon}
                alt="Evaluación Completada"
                width={64}
                height={64}
              />
              <h1 className="text-3xl font-bold text-gray-900 mt-4">
                ¡Evaluación Completada!
              </h1>
              <p className="text-base text-gray-600 mt-2">{evaluation.name}</p>
            </div>
            {hasArmVolumes ? (
              <>
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Volumen de brazos
                  </h2>

                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700 font-medium">
                      {evaluation.expectedResults.leftVolume ??
                        "Brazo Izquierdo"}
                    </span>
                    <span className="font-semibold text-purple">
                      {formatDisplayNumber(Number(results.results.leftVolume))}{" "}
                      ml
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-700 font-medium">
                      {evaluation.expectedResults.rightVolume ??
                        "Brazo Derecho"}
                    </span>
                    <span className="font-semibold text-purple">
                      {formatDisplayNumber(Number(results.results.rightVolume))}{" "}
                      ml
                    </span>
                  </div>
                </div>

                {/* DIFFERENCE */}
                {(() => {
                  const status = getHealthStatus(
                    Number(results.results.difference),
                  );

                  return (
                    <div
                      className={`${status.bgClass} ${status.borderClass} border rounded-2xl p-4 mb-6`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {status.icon}
                          <span
                            className="text-lg font-bold"
                            style={{ color: status.color }}
                          >
                            {evaluation.expectedResults.difference ??
                              "Diferencia"}
                          </span>
                        </div>

                        <span
                          className="text-2xl font-bold"
                          style={{ color: status.color }}
                        >
                          {formatDisplayNumber(
                            Number(results.results.difference),
                          )}{" "}
                          ml
                        </span>
                      </div>

                      <div
                        className="rounded-lg p-3"
                        style={{
                          backgroundColor: `${status.color}20`,
                        }}
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
                  );
                })()}
              </>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="h-5 w-5 text-purple" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Resultados
                  </h2>
                </div>

                {Object.entries(results.results).map(([key, value]) => {
                  const { label, unit } = getResultLabel(key);

                  const formattedValue = isTimeType
                    ? value
                    : Number(value).toFixed(1);

                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl p-4 border mb-3"
                    >
                      <p className="text-sm text-gray-500 capitalize mb-1">
                        {label}
                      </p>
                      <p className="text-3xl font-bold text-purple">
                        {formattedValue}
                        {unit ? ` ${unit}` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
