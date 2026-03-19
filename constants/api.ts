export const SYNAPSE_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const SYNAPSE_API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  WORKSPACES: {
    LIST: '/workspaces',
    CREATE: '/workspaces',
    DETAIL: (id: string) => `/workspaces/${id}`,
    UPDATE: (id: string) => `/workspaces/${id}`,
    DELETE: (id: string) => `/workspaces/${id}`,
  },
  CHANNELS: {
    LIST: (workspaceSlug: string) => `/workspaces/${workspaceSlug}/channels`,
    CREATE: (workspaceSlug: string) => `/workspaces/${workspaceSlug}/channels`,
    DETAIL: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}`,
    UPDATE: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}`,
    DELETE: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}`,
  },
} as const;