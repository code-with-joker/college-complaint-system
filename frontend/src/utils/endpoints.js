export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register"
  },

  COMPLAINTS: {
    CREATE: "/complaints/create",
    MY: "/complaints/my",
    ASSIGNED: "/complaints/assigned",
    UPDATE_STATUS: (id) => `/complaints/status/${id}`
  },

  NOTIFICATIONS: {
    GET_ALL: "/notifications"
  },

  CONFIG: {
    DEPARTMENTS: "/config/departments",
    CATEGORIES: "/config/categories"
  }
};