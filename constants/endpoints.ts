export const ENDPOINTS = {
  AUTH: {
    SIGNIN: "/api/v1/auth/signin",
    SIGNUP: "/api/v1/auth/signup",
    REFRESH: "/api/v1/auth/refresh",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    REQUEST_RESET_PASSWORD: "/api/v1/auth/requestResetPassword",
    UPDATE_PASSWORD: "/api/v1/auth/updatePassword",
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
  NOTIFICATIONS: {
    REGISTER_TOKEN: "/api/v1/notifications/token",
    REMOVE_TOKEN: "/api/v1/notifications/token",
    PREFERENCES: "/api/v1/notifications/preferences",
  },
  PUBLIC: {
    ARM_VOLUME: "/api/v1/evaluation/measure/calculate",
    ARM_VOLUME_VIDEO: "/api/v1/evaluation/measure",
  },
  PROFILE: {
    PICTURE: "/api/v1/users/profile/photo",
  },
};
