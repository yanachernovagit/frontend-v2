export interface Exercise {
  name: string;
  bodyPart: string;
  description: string;
  videoUrl: string;
  videoCoverUrl: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  order: number;
}

export interface Routine {
  title: string;
  order: number;
  iconUrl: string;
  exercises: Exercise[];
}

export interface UserPlan {
  id: string;
  userId: string;
  phase: number;
  stage: number;
  progressRoutine: number;
  progressExercise: number;
  totalWeeks: number;
  currentWeek: number;
  completedToday: boolean;
  routines: Routine[];
}

export type ChangePlanPhaseDto = {
  phase: number;
  surgeryDate: string;
};
