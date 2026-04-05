import { SYNAPSE_API_ENDPOINTS } from '@/constants/api';
import {
  Message,
  MessageReactionActor,
  MessageReactionGroup,
} from '@/lib/types/message.types';
import { apiService } from './api.service';

export type MessageSearchFilters = {
  keyword?: string;
  username?: string;
  date?: string;
  tag?: string;
};

export type ToggleReactionResponse = {
  messageId: string;
  emoji: string;
  action: 'added' | 'removed';
  reactions: MessageReactionGroup[];
};

export type MessageReactionsResponse = {
  messageId: string;
  reactions: MessageReactionGroup[];
};

export type MessageReactionUsersResponse = {
  messageId: string;
  emoji: string;
  reactors: MessageReactionActor[];
  count: number;
};

export type MessageRepliesResponse = {
  messageId: string;
  replies: Message[];
};

export type MessageThreadResponse = {
  rootMessageId: string;
  thread: Message[];
};

class MessagesService {
  async search(
    workspaceSlug: string,
    channelId: string,
    filters: MessageSearchFilters,
  ): Promise<Message[]> {
    const params = new URLSearchParams();

    if (filters.keyword?.trim()) {
      params.set('keyword', filters.keyword.trim());
    }

    if (filters.username?.trim()) {
      params.set('username', filters.username.trim());
    }

    if (filters.date?.trim()) {
      params.set('date', filters.date.trim());
    }

    if (filters.tag?.trim()) {
      params.set('tag', filters.tag.trim());
    }

    return apiService.request<Message[]>(
      'GET',
      SYNAPSE_API_ENDPOINTS.MESSAGES.SEARCH(
        workspaceSlug,
        channelId,
        params.toString(),
      ),
    );
  }

  async pin(
    workspaceSlug: string,
    channelId: string,
    messageId: string,
  ): Promise<Message> {
    return apiService.request<Message>(
      'POST',
      SYNAPSE_API_ENDPOINTS.MESSAGES.PIN(workspaceSlug, channelId, messageId),
    );
  }

  async unpin(
    workspaceSlug: string,
    channelId: string,
    messageId: string,
  ): Promise<{ messageId: string }> {
    return apiService.request<{ messageId: string }>(
      'DELETE',
      SYNAPSE_API_ENDPOINTS.MESSAGES.PIN(workspaceSlug, channelId, messageId),
    );
  }

  async markSeen(
    workspaceSlug: string,
    channelId: string,
    messageId: string,
  ): Promise<{ messageId: string; seenAt: string }> {
    return apiService.request<{ messageId: string; seenAt: string }>(
      'POST',
      SYNAPSE_API_ENDPOINTS.MESSAGES.MARK_SEEN(
        workspaceSlug,
        channelId,
        messageId,
      ),
    );
  }

  async toggleReaction(
    workspaceSlug: string,
    channelId: string,
    messageId: string,
    emoji: string,
  ): Promise<ToggleReactionResponse> {
    return apiService.request<ToggleReactionResponse>(
      'POST',
      SYNAPSE_API_ENDPOINTS.MESSAGES.TOGGLE_REACTION(
        workspaceSlug,
        channelId,
        messageId,
        emoji,
      ),
    );
  }

  async getReactions(
    workspaceSlug: string,
    channelId: string,
    messageId: string,
  ): Promise<MessageReactionsResponse> {
    return apiService.request<MessageReactionsResponse>(
      'GET',
      SYNAPSE_API_ENDPOINTS.MESSAGES.REACTIONS(
        workspaceSlug,
        channelId,
        messageId,
      ),
    );
  }

  async getReactionUsers(
    workspaceSlug: string,
    channelId: string,
    messageId: string,
    emoji: string,
  ): Promise<MessageReactionUsersResponse> {
    return apiService.request<MessageReactionUsersResponse>(
      'GET',
      SYNAPSE_API_ENDPOINTS.MESSAGES.REACTION_USERS(
        workspaceSlug,
        channelId,
        messageId,
        emoji,
      ),
    );
  }

  async getReplies(
    workspaceSlug: string,
    channelId: string,
    messageId: string,
  ): Promise<MessageRepliesResponse> {
    return apiService.request<MessageRepliesResponse>(
      'GET',
      SYNAPSE_API_ENDPOINTS.MESSAGES.REPLIES(workspaceSlug, channelId, messageId),
    );
  }

  async getThread(
    workspaceSlug: string,
    channelId: string,
    messageId: string,
  ): Promise<MessageThreadResponse> {
    return apiService.request<MessageThreadResponse>(
      'GET',
      SYNAPSE_API_ENDPOINTS.MESSAGES.THREAD(workspaceSlug, channelId, messageId),
    );
  }
}

export const messagesService = new MessagesService();
