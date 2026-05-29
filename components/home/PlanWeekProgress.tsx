"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CalendarDays, Info } from "lucide-react";

import { SkeletonLoader } from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { PhaseEnum } from "@/constants/enums";
import { useStepsHistory } from "@/hooks/useStepsHistory";
import { useUserPlan } from "@/hooks/useUserPlan";
import { changePlanPhaseService } from "@/services/userPlanService";

import ApprovalBlue from "@/public/icons/blue/Approval (1).svg";
import TrainersMagent from "@/public/icons/magent/Trainers-magent.svg";

import { OperationDateModal } from "./OperationDateModal";

export function PlanWeekProgress() {
  const { userPlan, loading, refetch } = useUserPlan();
  const { steps, refetch: refetchSteps } = useStepsHistory(1);
  const [isUpdatingPhase, setIsUpdatingPhase] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null,
  );

  useEffect(() => {
    const onFocus = () => {
      void Promise.all([refetch(), refetchSteps()]);
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch, refetchSteps]);

  const todaySteps = steps[0]?.steps || 0;
  const stepsGoal = 6000;
  const stepsProgress = Math.min(
    100,
    Math.round((todaySteps / stepsGoal) * 100),
  );

  const progress = useMemo(() => {
    if (!userPlan) return 0;
    const currentWeek = Math.max(1, userPlan.currentWeek || 1);
    const totalWeeks = Math.max(1, userPlan.totalWeeks || 1);
    if (currentWeek > totalWeeks) return 100;
    return Math.min(100, Math.round((currentWeek / totalWeeks) * 100));
  }, [userPlan]);

  if (loading) {
    return (
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
        <SkeletonLoader width="40%" height={16} />
        <div className="mt-3">
          <SkeletonLoader width="60%" height={14} />
        </div>
        <div className="mt-4">
          <SkeletonLoader width="100%" height={10} />
        </div>
      </div>
    );
  }

  if (!userPlan || !userPlan.totalWeeks) {
    return (
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
        <h3 className="text-base font-semibold text-gray-900">
          Progreso del plan
        </h3>
        <p className="mt-2 text-sm text-gray-600">Plan no disponible</p>
      </div>
    );
  }

  const currentWeek = Math.max(1, userPlan.currentWeek || 1);
  const totalWeeks = Math.max(1, userPlan.totalWeeks);
  const isCompleted = currentWeek > totalWeeks;
  const isPlanFinished = isCompleted;

  const handleChangePhase = async (operationDate: Date) => {
    if (isUpdatingPhase) return;

    try {
      setIsUpdatingPhase(true);
      const isoDate = new Date(
        `${operationDate.toISOString().slice(0, 10)}T00:00:00`,
      ).toISOString();

      await changePlanPhaseService({
        phase: PhaseEnum.POST,
        surgeryDate: isoDate,
      });

      await refetch();
      setIsModalVisible(false);
      setFeedbackType("success");
      setFeedback("Fase actualizada. Tu plan ahora está en postcirugía.");
    } catch {
      setFeedbackType("error");
      setFeedback("No se pudo actualizar la fase. Intentalo nuevamente.");
    } finally {
      setIsUpdatingPhase(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100">
            <CalendarDays className="h-3.5 w-3.5 text-purple" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Progreso del plan
          </h3>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1">
            <Image src={ApprovalBlue} alt="Completado" width={12} height={12} />
            <span className="text-xs font-semibold text-purple">
              Completado
            </span>
          </div>
        ) : (
          <div className="rounded-full bg-purple-100 px-3 py-1">
            <span className="text-xs font-semibold text-purple">
              {progress}%
            </span>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Semana {currentWeek} de {totalWeeks}
      </p>

      <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-purple"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-magent-200">
              <Image src={TrainersMagent} alt="Pasos" width={14} height={14} />
            </div>
            <p className="text-lg font-semibold text-gray-900">Pasos de hoy</p>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-magent">
              {todaySteps.toLocaleString()}
            </span>
            <span className="text-base text-gray-500">
              / {stepsGoal.toLocaleString()} pasos
            </span>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-magent"
            style={{ width: `${stepsProgress}%` }}
          />
        </div>
      </div>

      {isPlanFinished ? (
        <div className="mt-4 rounded-lg bg-purple-400 p-3">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4.5 w-4.5 text-purple" />
            <p className="flex-1 text-sm leading-5 text-white">
              Ya terminaste tu plan. Completa la segunda evaluación para ver tu
              progreso.
            </p>
          </div>
        </div>
      ) : null}

      {feedback ? (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            feedbackType === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {feedback}
        </div>
      ) : null}

      {userPlan.phase === PhaseEnum.PRE ? (
        <div className="mt-4">
          <Button
            onClick={() => setIsModalVisible(true)}
            className="w-full rounded-full bg-purple text-white hover:bg-purple/90"
            disabled={isUpdatingPhase}
          >
            Ya me opere
          </Button>
        </div>
      ) : null}

      <OperationDateModal
        visible={isModalVisible}
        isSubmitting={isUpdatingPhase}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleChangePhase}
      />
    </div>
  );
}
