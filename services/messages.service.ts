import { SYNAPSE_API_ENDPOINTS } from '@/constants/api';
import {
  Message,
  MessageReactionActor,
  MessageReactionGroup,
} from '@/lib/types/message.types';
import { apiService } from './api.service';

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
