import { ExerciseCatalog, RoutineCatalog } from "./admin";

// --- Response types (lo que devuelve el endpoint GET) ---

export type RoutineVariationExercise = {
  id: string;
  routineVariationRoutineId: string;
  exerciseCatalogId: string;
  order: number;
  exerciseCatalog: ExerciseCatalog;
};

export type RoutineVariationRoutine = {
  id: string;
  routineVariationId: string;
  routineCatalogId: string;
  order: number;
  routineCatalog: RoutineCatalog;
  exercises: RoutineVariationExercise[];
};

export type RoutineVariation = {
  id: string;
  phase: number;
  availableWeeks: number[];
  name: string;
  createdAt?: string;
  updatedAt?: string;
  routines: RoutineVariationRoutine[];
};

// --- Payload types (lo que se envía al endpoint POST) ---

export type CreateRoutineVariationExercise = {
  exerciseCatalogId: string;
  order: number;
};

export type CreateRoutineVariationRoutine = {
  routineCatalogId: string;
  order: number;
  exercises: CreateRoutineVariationExercise[];
};

export type CreateRoutineVariationPayload = {
  phase: number;
  availableWeeks: number[];
  name: string;
  routines: CreateRoutineVariationRoutine[];
};
