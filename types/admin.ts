export type ExerciseCatalog = {
  id: string;
  name: string;
  description?: string | null;
  bodyPart?: string | null;
  videoUrl?: string | null;
  videoCoverUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RoutineCatalog = {
  id: string;
  title: string;
  order: number;
  iconUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string;
  debug: boolean;
  createdAt?: string | null;
  lastSignInAt?: string | null;
};

export type MediaAssociation = {
  entity: "evaluation" | "exercise" | "routine";
  id: string;
  field: string;
  label: string;
};

export type MediaAsset = {
  id: string;
  key: string;
  url: string;
  size: number;
  lastModified?: string;
  associations: MediaAssociation[];
};

export type MediaUploadResponse = {
  key: string;
  url: string;
  bucket: string;
  contentType?: string;
  size: number;
};

export type MediaRenameResponse = {
  oldKey: string;
  newKey: string;
  oldUrl: string;
  newUrl: string;
  associationsUpdated: number;
};

export type MediaDeleteResponse = {
  key: string;
  deleted: boolean;
};

export type AIConfig = {
  provider: string;
  model: string;
  temperature: string;
  maxBaselinePercent: string;
  fatigueHighReduction: string;
  fatigueMediumReduction: string;
  fatigueLowIncrease: string;
  setsRange: string;
  repsRange: string;
  weightIncrement: string;
  durationIncrement: string;
};

export type AIStats = {
  total: number;
  today: number;
  bySource: Record<string, number>;
  last7Days: Array<{ date: string; count: number; source: string }>;
};

export type AdminUserDetail = AdminUser & {
  plan: {
    id: string;
    phase: number;
    stage: number;
    currentWeek: number;
    totalWeeks: number;
    completedToday: boolean;
    progressRoutine: number;
    progressExercise: number;
  } | null;
  tasks: {
    profileCompleted: boolean;
    firstEvaluationCompleted: boolean;
    secondEvaluationCompleted: boolean;
    dailyPlanCompleted: boolean;
  } | null;
  latestFatigue: {
    level: number;
    date: string;
  } | null;
  profileAnswers: Array<{
    questionTitle: string;
    answer: string;
  }>;
};

export type PrescriptionHistoryItem = {
  id: string;
  date: string;
  phase: number;
  stage: number;
  source: string;
  createdAt: string;
};
