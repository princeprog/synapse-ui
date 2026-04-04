import { SYNAPSE_API_ENDPOINTS } from '@/constants/api';
import { MessageReactionActor, MessageReactionGroup } from '@/lib/types/message.types';
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
}

export const messagesService = new MessagesService();
