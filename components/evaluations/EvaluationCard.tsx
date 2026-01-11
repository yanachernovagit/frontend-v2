"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Edit } from "lucide-react";

import { UserEvaluation } from "@/types";
import { EvaluationTypeEnum } from "@/constants/enums";
import { useCommonUtils } from "@/hooks/useCommonUtils";

import ApprovalWhite from "@/public/icons/white/Approval.svg";

type Props = {
  evaluation: UserEvaluation;
  onPress?: () => void;
};

export function EvaluationCard({ evaluation, onPress }: Props) {
  const { evaluation: evalData, completed, results } = evaluation;
  const { name, description, type, seconds, logoUrl, imageUrl } = evalData;
  const { formatDisplayNumber } = useCommonUtils();

  const isTimeType = type === EvaluationTypeEnum.TIME;

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      onClick={onPress}
      className={`
        rounded-2xl border transition p-4 min-h-[180px]
        ${onPress ? "cursor-pointer hover:shadow-md" : ""}
      `}
    >
      <CardContent className="flex flex-col justify-between gap-3 p-0 min-h-[148px]">
        <div className="flex items-center h-14">
          <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={logoUrl}
                alt={name}
                width={36}
                height={36}
                className="w-[65%] h-[65%]"
              />
            )}
          </div>

          <div className="flex-1 mx-4 overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 truncate">{name}</h3>
            <p className="text-sm text-gray-500 truncate">{description}</p>
          </div>

          {!completed && (
            <Button size="sm" className="rounded-full bg-purple px-4">
              Realizar
            </Button>
          )}
        </div>

        {!completed && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2">
            {isTimeType ? (
              <>
                <Timer className="h-4 w-4 text-purple" />
                <span className="text-gray-700">Duración: {formatTime()}</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 text-purple" />
                <span className="text-gray-700">Requiere medidas</span>
              </>
            )}
          </div>
        )}

        {completed && results && (
          <>
            <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-purple bg-purple px-4 py-2">
              <Image src={ApprovalWhite} alt={name} width={20} height={20} />
              <span className="font-bold text-white">Completado</span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {Object.entries(results).map(([key, value]) => {
                  const label =
                    evalData.expectedResults[key] || key.replace(/_/g, " ");
                  const unit = isTimeType ? "" : "ml";

                  const formattedValue = isTimeType
                    ? value
                    : formatDisplayNumber(Number(value));

                  return (
                    <div
                      key={key}
                      className="w-[48%] rounded-xl border border-gray-200 bg-white p-3"
                    >
                      <p className="text-sm text-gray-500 capitalize">
                        {label}
                      </p>

                      <div className="mt-1 flex items-baseline">
                        <span className="text-xl font-bold text-purple">
                          {formattedValue}
                        </span>
                        {unit && (
                          <span className="ml-1 text-sm font-semibold text-purple">
                            {unit}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {completed && !results && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2">
            {isTimeType ? (
              <>
                <Timer className="h-4 w-4 text-purple" />
                <span className="text-gray-700">Duración: {formatTime()}</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 text-purple" />
                <span className="text-gray-700">Requiere medidas</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
