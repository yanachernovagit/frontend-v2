"use client";

import Image from "next/image";
import { UserEvaluation } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCommonUtils } from "@/hooks/useCommonUtils";
import { Clock, Edit } from "lucide-react";

type Props = {
  evaluation: UserEvaluation;
  onPress?: () => void;
  hideInstructions?: boolean;
};

export function EvaluationCard({
  evaluation,
  onPress,
  hideInstructions = false,
}: Props) {
  const { evaluation: evalData, completed, results } = evaluation;
  const { name, description, isTime, seconds, logoUrl } = evalData;
  const { formatDisplayNumber } = useCommonUtils();

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      onClick={onPress}
      className="rounded-xl p-4 bg-white border border-gray-200 cursor-pointer transition-all hover:shadow-lg hover:border-purple/30"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-purple/10 rounded-xl flex items-center justify-center shrink-0">
          <Image
            src={logoUrl}
            alt={name}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900 flex-1 leading-tight">
              {name}
            </h3>
            {completed && (
              <div className="flex items-center gap-1 text-magent">
                <Image
                  src="/icons/magent/Task-magent.svg"
                  alt="Completada"
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                Completado
              </div>
            )}
          </div>

          {!hideInstructions && (
            <>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {description}
              </p>

              <div className="flex items-center gap-3 mb-2">
                {isTime ? (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple" />
                    <span className="text-xs text-gray-700 font-medium">
                      {formatTime()}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5 text-purple" />
                    <span className="text-xs text-gray-700 font-medium">
                      Requiere medidas
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {completed && results && Object.entries(results).length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {Object.entries(results).map(([key, value]) => {
                  const label =
                    evalData.expectedResults[key] || key.replace(/_/g, " ");
                  const unit = isTime ? "" : "ml";
                  const formattedValue = isTime
                    ? value
                    : formatDisplayNumber(Number(value));

                  return (
                    <div
                      key={key}
                      className="bg-purple/10 rounded-lg px-3 py-1.5 border border-purple-400"
                    >
                      <div className="text-[10px] text-purple-600 font-medium uppercase tracking-wide mb-0.5">
                        {label}
                      </div>
                      <div className="text-sm font-bold text-purple">
                        {formattedValue} {unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {!completed && (
          <div className="self-start">
            <Badge className="bg-purple text-white hover:bg-purple/90 text-xs px-2.5 py-1">
              Realizar
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
