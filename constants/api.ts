export const SYNAPSE_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const SYNAPSE_API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  USERS: {
    MY_PROFILE: '/my/profile',
    DETAIL: (id: string) => `/users/${id}`,
  },
  WORKSPACES: {
    LIST: '/workspaces',
    CREATE: '/workspaces',
    DETAIL: (id: string) => `/workspaces/${id}`,
    UPDATE: (id: string) => `/workspaces/${id}`,
    DELETE: (id: string) => `/workspaces/${id}`,
    MY_NOTIFICATIONS: '/workspaces/notifications/me',
    MY_INVITATIONS: '/workspaces/invitations/me',
    ACCEPT_INVITATION: (invitationId: string) =>
      `/workspaces/invitations/${invitationId}/accept`,
    DECLINE_INVITATION: (invitationId: string) =>
      `/workspaces/invitations/${invitationId}/decline`,
    MEMBERS: (workspaceSlug: string) => `/workspaces/${workspaceSlug}/members`,
    UPDATE_MEMBER_ROLE: (workspaceSlug: string, memberId: string) =>
      `/workspaces/${workspaceSlug}/members/${memberId}`,
    UPDATE_MEMBER_PROFILE: (workspaceSlug: string, memberId: string) =>
      `/workspaces/${workspaceSlug}/members/${memberId}/profile`,
    REMOVE_MEMBER: (workspaceSlug: string, memberId: string) =>
      `/workspaces/${workspaceSlug}/members/${memberId}`,
    INVITE_MEMBER: (workspaceSlug: string) => `/workspaces/${workspaceSlug}/invitations`,
    INVITATIONS: (workspaceSlug: string) =>
      `/workspaces/${workspaceSlug}/invitations`,
    INVITATION_DETAIL: (workspaceSlug: string, invitationId: string) =>
      `/workspaces/${workspaceSlug}/invitations/${invitationId}`,
  },
  CHANNELS: {
    LIST: (workspaceSlug: string) => `/workspaces/${workspaceSlug}/channels`,
    CREATE: (workspaceSlug: string) => `/workspaces/${workspaceSlug}/channels`,
    DETAIL: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}`,
    UPDATE: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}`,
    MARK_READ: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/read`,
    DELETE: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}`,
  },
  MESSAGES: {
    LIST: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages`,
    SEARCH: (workspaceSlug: string, channelId: string, query: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/search${query ? `?${query}` : ''}`,
    PIN: (workspaceSlug: string, channelId: string, messageId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/${messageId}/pin`,
    PINNED: (workspaceSlug: string, channelId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/pinned`,
    MARK_SEEN: (workspaceSlug: string, channelId: string, messageId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/${messageId}/seen`,
    REPLIES: (
      workspaceSlug: string,
      channelId: string,
      messageId: string,
    ) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/${messageId}/replies`,
    THREAD: (
      workspaceSlug: string,
      channelId: string,
      messageId: string,
    ) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/${messageId}/thread`,
    TOGGLE_REACTION: (
      workspaceSlug: string,
      channelId: string,
      messageId: string,
      emoji: string,
    ) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
    REACTIONS: (workspaceSlug: string, channelId: string, messageId: string) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/${messageId}/reactions`,
    REACTION_USERS: (
      workspaceSlug: string,
      channelId: string,
      messageId: string,
      emoji: string,
    ) =>
      `/workspaces/${workspaceSlug}/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/users`,
  },
} as const;