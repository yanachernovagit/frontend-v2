export const ADMIN_ENDPOINTS = {
  STATS: "/api/v1/admin/stats",
  EVALUATIONS: {
    LIST: "/api/v1/admin/evaluations",
    GET: (id: string) => `/api/v1/admin/evaluations/${id}`,
    CREATE: "/api/v1/admin/evaluations",
    UPDATE: (id: string) => `/api/v1/admin/evaluations/${id}`,
    DELETE: (id: string) => `/api/v1/admin/evaluations/${id}`,
  },
  EXERCISES: {
    LIST: "/api/v1/admin/exercises",
    GET: (id: string) => `/api/v1/admin/exercises/${id}`,
    CREATE: "/api/v1/admin/exercises",
    UPDATE: (id: string) => `/api/v1/admin/exercises/${id}`,
    DELETE: (id: string) => `/api/v1/admin/exercises/${id}`,
  },
  ROUTINES: {
    LIST: "/api/v1/admin/routines",
    GET: (id: string) => `/api/v1/admin/routines/${id}`,
    CREATE: "/api/v1/admin/routines",
    UPDATE: (id: string) => `/api/v1/admin/routines/${id}`,
    DELETE: (id: string) => `/api/v1/admin/routines/${id}`,
  },
  QUESTIONS: {
    LIST: "/api/v1/admin/questions",
    GET: (id: string) => `/api/v1/admin/questions/${id}`,
    CREATE: "/api/v1/admin/questions",
    UPDATE: (id: string) => `/api/v1/admin/questions/${id}`,
    DELETE: (id: string) => `/api/v1/admin/questions/${id}`,
  },
  USERS: {
    LIST: "/api/v1/admin/users",
    UPDATE_ROLE: (id: string) => `/api/v1/admin/users/${id}/role`,
  },
};
