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
    BY_USER_PERIOD: (userId: string, period: string) =>
      `/userStep/userId/${userId}/period/${period}`,
    CREATE: "/userStep",
  },
  EVALUATIONS: {
    USER_LIST: (userId: string) => `/api/v1/evaluation/${userId}`,
    COMPLETE: "/api/v1/evaluation/complete",
  },
  USER_PLAN: {
    GET: (userId: string) => `/api/v1/plan/${userId}`,
    UPDATE_EXERCISE: (userId: string) => `/api/v1/plan/${userId}/progress`,
  },
  USER_EXERCISE: {
    CURRENT_BY_USER: (userId: string) => `/userExercise/current/user/${userId}`,
  },
  USER_TASKS: {
    GET: "/api/v1/users/tasks",
  },
};
