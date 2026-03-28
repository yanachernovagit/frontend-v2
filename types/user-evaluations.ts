import {
  EvaluationTypeEnum,
  PhaseEnum,
  ProgressPointEnum,
} from "@/constants/enums";

export interface Evaluation {
  id: string;
  name: string;
  description: string;
  howToDo: string;
  imageUrl: string;
  logoUrl: string;
  videoUrl: string;
  isTime: boolean;
  type: EvaluationTypeEnum;
  seconds: number;
  order: number;
  expectedResults: Record<string, string>;
  feedbackRules?:
    | TimeFeedbackRules
    | MeasureFeedbackRules
    | MovementFeedbackRules;
  createdAt: string;
  updatedAt: string;
}

export type StsAgeRange = {
  minAge: number;
  maxAge: number;
  p25: number;
  p75: number;
};

export type StsMessages = {
  below: string;
  within: string;
  above: string;
};

export type TimeFeedbackRules = {
  metricKey: string;
  ageRanges: StsAgeRange[];
  stsMessages: StsMessages;
};

export type MeasureFeedbackRange = {
  min: number;
  max?: number;
  level: string;
  message: string;
};

export type MeasureFeedbackRules = {
  metricKey: string;
  ranges: MeasureFeedbackRange[];
};

export type MovementFeedbackValue = {
  level: string;
  message: string;
};

export type MovementFeedbackRules = {
  valueFeedback: Record<string, MovementFeedbackValue>;
};

export interface UserEvaluation {
  evaluation: Evaluation;
  completed: boolean;
  doneAt: string | null;
  results: Record<string, unknown> | null;
  progressPoint: ProgressPointEnum;
}

export interface CompletedUserEvaluation {
  id: string;
  userId: string;
  evaluationId: string;
  doneAt: string;
  results: Record<string, unknown>;
}

export interface GroupedUserEvaluations {
  pre_plan: UserEvaluation[];
  post_plan: UserEvaluation[];
}

export type CompleteEvaluationDto = {
  evaluationId: string;
  phase: PhaseEnum;
  results: Record<string, unknown>;
};
