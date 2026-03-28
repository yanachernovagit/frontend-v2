"use client";

import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Timer,
  XCircle,
  type LucideIcon,
} from "lucide-react";

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

type BackendFeedback = {
  level: string;
  message: string;
  ruleType: "range" | "value" | "default";
};

type FeedbackStyle = {
  border: string;
  bg: string;
  text: string;
  Icon: LucideIcon;
  iconClass: string;
};

export function CompletedEvaluationView({
  results,
  evaluation,
}: CompletedEvaluationViewProps) {
  const { formatDisplayNumber } = useCommonUtils();
  const { user } = useAuth();
  const normalizeText = (value: unknown) =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const isTimeType = evaluation.type === EvaluationTypeEnum.TIME;
  const isMeasureType = evaluation.type === EvaluationTypeEnum.MEASURE;
  const isMovementRangeType =
    evaluation.type === EvaluationTypeEnum.MOVEMENT_RANGE;

  const backendFeedback =
    (results as unknown as { feedback?: BackendFeedback | null }).feedback ??
    null;
  const rulesRaw = (evaluation.feedbackRules ?? null) as Record<
    string,
    unknown
  > | null;
  const hasFeedbackRules = !!rulesRaw && Object.keys(rulesRaw).length > 0;
  const validBackendFeedback =
    hasFeedbackRules && backendFeedback?.level && backendFeedback?.message
      ? backendFeedback
      : null;

  const getUserAge = (): number | null => {
    const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
    const birthDateRaw =
      metadata.birthDate ??
      metadata.birth_date ??
      metadata.dateOfBirth ??
      metadata.date_of_birth;

    if (typeof birthDateRaw === "string" && birthDateRaw.trim().length > 0) {
      const age = getAgeFromBirthDate(birthDateRaw);
      return Number.isFinite(age) ? age : null;
    }

    const ageRaw = metadata.age;
    const age = typeof ageRaw === "number" ? ageRaw : Number(ageRaw);
    return Number.isFinite(age) ? age : null;
  };

  const stsFeedback = (() => {
    if (!hasFeedbackRules) return null;
    if (!isTimeType) return null;
    if (evaluation.name !== "Test sentarse y levantarse") return null;

    const age = getUserAge();
    if (age == null) return null;

    const rules = (rulesRaw ?? {}) as Record<string, unknown>;
    const ageRanges = Array.isArray(rules.ageRanges) ? rules.ageRanges : [];
    if (ageRanges.length === 0) return null;

    const metricKey =
      typeof rules.metricKey === "string"
        ? String(rules.metricKey)
        : Object.keys(results.results ?? {})[0];

    if (!metricKey) return null;

    const metricRaw = (results.results as Record<string, unknown>)?.[metricKey];
    const metric =
      typeof metricRaw === "number" ? metricRaw : Number(metricRaw);
    if (!Number.isFinite(metric)) return null;

    return getStsFeedback(metric, age, {
      ageRanges,
      stsMessages:
        rules.stsMessages && typeof rules.stsMessages === "object"
          ? (rules.stsMessages as Record<string, string>)
          : null,
    });
  })();

  const feedbackToShow = (() => {
    if (!hasFeedbackRules) return null;
    if (validBackendFeedback) return validBackendFeedback;

    if (isTimeType) {
      if (!stsFeedback) return null;
      return {
        level: stsFeedback.level,
        message: stsFeedback.message,
        ruleType: "value" as const,
      };
    }

    const rules = rulesRaw as Record<string, any> | null;
    if (!rules || typeof rules !== "object") return null;

    if (isMovementRangeType) {
      const raw =
        (results.results as Record<string, unknown>)?.resultado ??
        (results.results as Record<string, unknown>)?.respuesta;

      if (raw == null) return null;
      const value = String(raw).trim();
      const normalizedValue = normalizeText(value);

      const direct =
        rules.valueFeedback?.[value] ??
        (() => {
          const matchedKey = Object.entries(
            evaluation.expectedResults ?? {},
          ).find(
            ([key, expectedValue]) =>
              normalizeText(key) === normalizedValue ||
              normalizeText(expectedValue) === normalizedValue,
          )?.[0];
          return (
            (matchedKey ? rules.valueFeedback?.[matchedKey] : null) ??
            Object.entries(rules.valueFeedback ?? {}).find(
              ([key]) => normalizeText(key) === normalizedValue,
            )?.[1]
          );
        })();

      if (direct?.level && direct?.message) {
        return { ...direct, ruleType: "value" as const };
      }

      if (rules.defaultFeedback?.level && rules.defaultFeedback?.message) {
        return { ...rules.defaultFeedback, ruleType: "default" as const };
      }

      return null;
    }

    if (isMeasureType) {
      const metricKey = rules.metricKey;
      if (!metricKey || !Array.isArray(rules.ranges)) {
        if (rules.defaultFeedback?.level && rules.defaultFeedback?.message) {
          return { ...rules.defaultFeedback, ruleType: "default" as const };
        }

        return null;
      }

      const metricRaw = (results.results as Record<string, unknown>)?.[
        metricKey
      ];
      const metric =
        typeof metricRaw === "number" ? metricRaw : Number(metricRaw);
      if (!Number.isFinite(metric)) return null;

      const hit = rules.ranges.find((r: any) => {
        const minOk = r.min == null || metric >= Number(r.min);
        const maxOk = r.max == null || metric <= Number(r.max);
        return minOk && maxOk;
      });

      if (hit?.level && hit?.message) {
        return {
          level: hit.level,
          message: hit.message,
          ruleType: "range" as const,
        };
      }

      if (rules.defaultFeedback?.level && rules.defaultFeedback?.message) {
        return { ...rules.defaultFeedback, ruleType: "default" as const };
      }
    }

    return null;
  })();

  const getResultLabel = (key: string): { label: string; unit: string } => {
    const expectedResultLabel = (
      evaluation.expectedResults as Record<string, unknown> | undefined
    )?.[key];

    if (typeof expectedResultLabel === "string") {
      return {
        label: expectedResultLabel,
        unit: isMeasureType ? "ml" : "",
      };
    }

    return {
      label:
        key === "resultado" || key === "respuesta"
          ? "Resultado"
          : key.replace(/_/g, " "),
      unit: isMeasureType ? "ml" : "",
    };
  };

  const getFeedbackStyle = (levelRaw?: string | null): FeedbackStyle => {
    const level = String(levelRaw ?? "").toLowerCase();

    const positive = ["a", "normalidad", "alto", "above", "ok", "good"];
    const warning = ["b", "c", "sugerencia_consulta", "within", "warn"];
    const negative = ["d", "consulta_precoz", "bajo", "below", "bad"];

    if (positive.some((v) => level.includes(v))) {
      return {
        border: "border-green-400",
        bg: "bg-green-50",
        text: "text-green-800",
        Icon: CheckCircle,
        iconClass: "text-green-500",
      };
    }

    if (negative.some((v) => level.includes(v))) {
      return {
        border: "border-red-400",
        bg: "bg-red-50",
        text: "text-red-800",
        Icon: XCircle,
        iconClass: "text-red-500",
      };
    }

    if (warning.some((v) => level.includes(v))) {
      return {
        border: "border-yellow-400",
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        Icon: AlertTriangle,
        iconClass: "text-yellow-600",
      };
    }

    return {
      border: "border-gray-300",
      bg: "bg-gray-50",
      text: "text-gray-800",
      Icon: Info,
      iconClass: "text-gray-500",
    };
  };

  const feedbackStyle = feedbackToShow
    ? getFeedbackStyle(feedbackToShow.level)
    : null;

  const measureMetricKey =
    isMeasureType &&
    typeof (evaluation.feedbackRules as Record<string, unknown> | undefined)
      ?.metricKey === "string"
      ? String((evaluation.feedbackRules as Record<string, unknown>).metricKey)
      : "difference";

  const movementCompletedEntry = (() => {
    if (!isMovementRangeType) return null;
    const payload = results.results ?? {};

    if ((payload as Record<string, unknown>).resultado !== undefined) {
      return [
        "resultado",
        (payload as Record<string, unknown>).resultado,
      ] as const;
    }

    if ((payload as Record<string, unknown>).respuesta !== undefined) {
      return [
        "respuesta",
        (payload as Record<string, unknown>).respuesta,
      ] as const;
    }

    const first = Object.entries(payload)[0];
    return first ? ([first[0], first[1]] as const) : null;
  })();

  const resultEntries = Object.entries(results.results ?? {}).filter(
    ([key]) => {
      if (isMeasureType) return key === measureMetricKey;
      if (isMovementRangeType && movementCompletedEntry) {
        return key === movementCompletedEntry[0];
      }
      return true;
    },
  );

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

            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Timer className="h-5 w-5 text-purple" />
                <h2 className="text-xl font-bold text-gray-900">Resultados</h2>
              </div>

              {resultEntries.map(([key, value]) => {
                const { label, unit } = getResultLabel(key);

                const numericValue =
                  typeof value === "number"
                    ? value
                    : typeof value === "string"
                      ? Number(value)
                      : NaN;

                const formattedValue = isMovementRangeType
                  ? (evaluation.expectedResults?.[String(value ?? "")] ??
                    String(value ?? ""))
                  : Number.isFinite(numericValue)
                    ? formatDisplayNumber(numericValue)
                    : String(value ?? "");

                return (
                  <div
                    key={key}
                    className="rounded-xl p-4 border mb-3 bg-white border-gray-200"
                  >
                    <p className="text-sm text-gray-500 capitalize mb-1">
                      {label}
                    </p>
                    <p className="text-3xl font-bold text-purple">
                      {formattedValue}
                      {unit ? ` ${unit}` : ""}
                    </p>

                    {feedbackToShow && feedbackStyle ? (
                      <div
                        className={`rounded-2xl p-4 mt-2 border ${feedbackStyle.border} ${feedbackStyle.bg}`}
                      >
                        <div className="flex items-start gap-2">
                          <feedbackStyle.Icon
                            className={`h-4 w-4 mt-0.5 ${feedbackStyle.iconClass}`}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-base font-semibold ${feedbackStyle.text}`}
                            >
                              {feedbackToShow.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
