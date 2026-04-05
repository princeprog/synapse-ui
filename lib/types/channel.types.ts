export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  unreadCount?: number;
  mentionUnreadCount?: number;
}

export interface CreateChannelRequest {
  name: string;
  description?: string;
}

export interface UpdateChannelRequest {
  name?: string;
  description?: string;
}

export interface DeleteChannelResponse {
  message: string;
}
