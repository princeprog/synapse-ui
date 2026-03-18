export const SYNAPSE_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const SYNAPSE_API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
} as const;