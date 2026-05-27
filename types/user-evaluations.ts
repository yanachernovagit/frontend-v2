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

export type EvaluationFeedbackRuleType = "range" | "value" | "default";

export type EvaluationFeedback = {
  level: string;
  message: string;
  ruleType: EvaluationFeedbackRuleType;
};

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

export type RangeFeedbackRule = {
  min: number;
  max?: number;
  level: string;
  message: string;
};

export type FeedbackValue = {
  level: string;
  message: string;
};

export type StsTimeFeedbackRules = {
  metricKey: string;
  ageRanges: StsAgeRange[];
  stsMessages: StsMessages;
};

export type GenericTimeFeedbackRules = {
  metricKey: string;
  ranges: RangeFeedbackRule[];
  defaultFeedback?: FeedbackValue;
};

export type TimeFeedbackRules = StsTimeFeedbackRules | GenericTimeFeedbackRules;

export type MeasureFeedbackRules = {
  metricKey: string;
  ranges: RangeFeedbackRule[];
  defaultFeedback?: FeedbackValue;
};

export type MovementFeedbackRules = {
  valueFeedback: Record<string, FeedbackValue>;
  defaultFeedback?: FeedbackValue;
};

export interface UserEvaluation {
  evaluation: Evaluation;
  completed: boolean;
  doneAt: string | null;
  results: Record<string, unknown> | null;
  progressPoint: ProgressPointEnum;
  feedback?: EvaluationFeedback | null;
}

export interface CompletedUserEvaluation {
  id: string;
  userId: string;
  evaluationId: string;
  doneAt: string;
  results: Record<string, unknown>;
  feedback?: EvaluationFeedback | null;
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
