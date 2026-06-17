export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://taskflow-pro-backend-qbtw.onrender.com'
).replace(/\/$/, '');

export const STORAGE_KEYS = {
  token: 'taskflow_admin_token',
  user: 'taskflow_admin_user'
} as const;
