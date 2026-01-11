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
  createdAt: string;
  updatedAt: string;
}

export interface UserEvaluation {
  evaluation: Evaluation;
  completed: boolean;
  doneAt: string | null;
  results: Record<string, any> | null;
  progressPoint: ProgressPointEnum;
}

export interface CompletedUserEvaluation {
  id: string;
  userId: string;
  evaluationId: string;
  doneAt: string;
  results: Record<string, any>;
}

export interface GroupedUserEvaluations {
  pre_plan: UserEvaluation[];
  post_plan: UserEvaluation[];
}

export type CompleteEvaluationDto = {
  evaluationId: string;
  phase: PhaseEnum;
  results: Record<string, any>;
};
