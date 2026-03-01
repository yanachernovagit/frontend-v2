"use client";

import Image from "next/image";
import { CheckCircle, AlertTriangle, XCircle, Timer } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import TaskMagentIcon from "@/public/icons/magent/Task-magent.svg";

import type { CompletedUserEvaluation, Evaluation } from "@/types";
import { useCommonUtils } from "@/hooks/useCommonUtils";
import { useAuth } from "@/hooks/useAuth";
import { EvaluationTypeEnum } from "@/constants/enums";
import { getAgeFromBirthDate, getStsFeedback } from "@/lib/stsEvaluation";

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
  const { formatDisplayNumber } = useCommonUtils();
  const { user } = useAuth();

  const isTimeType = evaluation.type === EvaluationTypeEnum.TIME;
  const isMeasureType = evaluation.type === EvaluationTypeEnum.MEASURE;
  const isMovementRangeType =
    evaluation.type === EvaluationTypeEnum.MOVEMENT_RANGE;
  const normalizedEvaluationName = evaluation.name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
  const isStsEvaluation = normalizedEvaluationName.includes(
    "sentarse y levantarse",
  );
  const birthDate = (user?.user_metadata as Record<string, unknown>)
    ?.birthDate as string | undefined;

  const stsFeedback = (() => {
    if (!isTimeType) return null;
    if (!isStsEvaluation) return null;
    if (!birthDate) return null;

    const age = getAgeFromBirthDate(birthDate);
    const repetitionsValue =
      Object.values(results.results).find((value) => {
        const parsed =
          typeof value === "number"
            ? value
            : typeof value === "string"
              ? Number(value)
              : NaN;
        return Number.isFinite(parsed);
      }) ?? null;

    if (repetitionsValue == null) return null;

    const repetitions = Number(repetitionsValue);
    if (!Number.isFinite(repetitions)) return null;

    return getStsFeedback(repetitions, age);
  })();

  const getResultLabel = (key: string): { label: string; unit: string } => {
    const expectedResult = evaluation.expectedResults[key];

    return {
      label:
        expectedResult ??
        (key === "resultado" ? "Resultado" : key.replace(/_/g, " ")),
      unit: isMeasureType ? "ml" : "",
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

  const movementRangeFeedback = (() => {
    if (!isMovementRangeType) return null;
    const storedValue =
      results.results.resultado ??
      results.results.respuesta ??
      Object.values(results.results)[0];
    if (!storedValue) return null;

    const feedbackMessage = {
      A: "Tu movilidad de hombro está dentro de lo esperado. ¡Muy bien! Te recomendamos seguir realizando tus ejercicios para mantener el movimiento.",
      B: "Tu movilidad de hombro está disminuida. Te recomendamos comenzar ejercicios de movilidad al menos 3 veces al día para ayudar a recuperarla.",
      C: "Tu movilidad de hombro está disminuida. Te recomendamos comenzar ejercicios de movilidad al menos 3 veces al día para ayudar a recuperarla.",
      D: "Tu movilidad de hombro está disminuida. Te recomendamos comenzar ejercicios de movilidad al menos 3 veces al día para ayudar a recuperarla.",
    } as const;

    const normalizedStoredValue = String(storedValue).trim();
    const selectedKey =
      (normalizedStoredValue in feedbackMessage
        ? normalizedStoredValue
        : Object.entries(evaluation.expectedResults).find(
            ([, value]) => value === normalizedStoredValue,
          )?.[0]) ?? null;

    if (!selectedKey || !(selectedKey in feedbackMessage)) return null;
    const selectedOption = selectedKey as keyof typeof feedbackMessage;

    return {
      isOptimal: selectedOption === "A",
      message: feedbackMessage[selectedOption],
    };
  })();
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

                  const numericValue =
                    typeof value === "number"
                      ? value
                      : typeof value === "string"
                        ? Number(value)
                        : NaN;

                  const formattedValue = isMovementRangeType
                    ? (evaluation.expectedResults[String(value ?? "")] ??
                      String(value ?? ""))
                    : isMeasureType && Number.isFinite(numericValue)
                      ? formatDisplayNumber(numericValue)
                      : String(value ?? "");

                  const feedbackColor = stsFeedback
                    ? stsFeedback.level === "above"
                      ? {
                          border: "border-green-400",
                          bg: "bg-green-50",
                          text: "text-green-800",
                          message: stsFeedback.message,
                        }
                      : stsFeedback.level === "within"
                        ? {
                            border: "border-yellow-400",
                            bg: "bg-yellow-50",
                            text: "text-yellow-800",
                            message: stsFeedback.message,
                          }
                        : {
                            border: "border-red-400",
                            bg: "bg-red-50",
                            text: "text-red-800",
                            message: stsFeedback.message,
                          }
                    : movementRangeFeedback
                      ? movementRangeFeedback.isOptimal
                        ? {
                            border: "border-green-400",
                            bg: "bg-green-50",
                            text: "text-green-800",
                            message: movementRangeFeedback.message,
                          }
                        : {
                            border: "border-yellow-400",
                            bg: "bg-yellow-50",
                            text: "text-yellow-800",
                            message: movementRangeFeedback.message,
                          }
                      : null;

                  return (
                    <div
                      key={key}
                      className={`rounded-xl p-4 border mb-3 ${
                        feedbackColor
                          ? `${feedbackColor.border} ${feedbackColor.bg}`
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <p className="text-sm text-gray-500 capitalize mb-1">
                        {label}
                      </p>
                      <p
                        className={`text-3xl font-bold ${
                          feedbackColor ? feedbackColor.text : "text-purple"
                        }`}
                      >
                        {formattedValue}
                        {unit ? ` ${unit}` : ""}
                      </p>
                      {feedbackColor ? (
                        <p
                          className={`mt-3 text-sm leading-5 ${feedbackColor.text}`}
                        >
                          {feedbackColor.message}
                        </p>
                      ) : null}
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
