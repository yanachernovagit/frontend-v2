import type { UserPlan } from "@/types";

type PlanTiming = Pick<UserPlan, "currentWeek" | "totalWeeks"> | null;

export const isPlanFinished = (plan: PlanTiming | undefined): boolean =>
  !!plan && plan.totalWeeks > 0 && plan.currentWeek > plan.totalWeeks;
