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
  ROUTINE_VARIATIONS: {
    LIST: "/api/v1/admin/routine-variations",
    GET: (id: string) => `/api/v1/admin/routine-variations/${id}`,
    CREATE: "/api/v1/admin/routine-variations",
    UPDATE: (id: string) => `/api/v1/admin/routine-variations/${id}`,
    DELETE: (id: string) => `/api/v1/admin/routine-variations/${id}`,
  },
  USERS: {
    LIST: "/api/v1/admin/users",
    UPDATE_ROLE: (id: string) => `/api/v1/admin/users/${id}/role`,
  },
  MEDIA: {
    LIST: "/api/v1/admin/media",
    UPLOAD: "/api/v1/admin/media/upload",
    RENAME: "/api/v1/admin/media/rename",
    DELETE: "/api/v1/admin/media",
  },
  NOTIFICATIONS: {
    TEMPLATES: "/api/v1/admin/notifications/templates",
    UPDATE_TEMPLATE: (id: string) =>
      `/api/v1/admin/notifications/templates/${id}`,
    STATS: "/api/v1/admin/notifications/stats",
    LOGS: "/api/v1/admin/notifications/logs",
    SEND_TEST: "/api/v1/admin/notifications/test",
  },
};
