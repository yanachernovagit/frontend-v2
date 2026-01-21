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
  createdAt?: string | null;
  lastSignInAt?: string | null;
};
