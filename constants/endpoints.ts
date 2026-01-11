export const ENDPOINTS = {
  AUTH: {
    SIGNIN: "/api/v1/auth/signin",
    SIGNUP: "/api/v1/auth/signup",
    REFRESH: "/api/v1/auth/refresh",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    REQUEST_RESET_PASSWORD: "/api/v1/auth/requestResetPassword",
  },
  PROFILE_QUESTIONS: {
    LIST: "/api/v1/profile-questions",
  },
  PROFILE_ANSWERS: {
    CREATE: "/api/v1/profile-questions/answer",
    CREATE_BULK: "/api/v1/profile-questions/answer/bulk",
  },
  STEPS: {
    BY_PERIOD: (period: number) => `/api/v1/user-step/period/${period}`,
    CREATE: "/api/v1/user-step",
  },
  EVALUATIONS: {
    ALL: "/api/v1/evaluation",
    USER_LIST: "/api/v1/evaluation/user",
    COMPLETE: "/api/v1/evaluation/complete",
  },
  USER_PLAN: {
    GET: "/api/v1/plan",
    UPDATE_EXERCISE: "/api/v1/plan/progress",
    UPDATE_PHASE: "/api/v1/plan/phase",
  },
  USER_TASKS: {
    GET: "/api/v1/users/tasks",
  },
};
