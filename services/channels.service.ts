import { SYNAPSE_API_ENDPOINTS } from '../constants/api';
import {
  Channel,
  CreateChannelRequest,
  DeleteChannelResponse,
  UpdateChannelRequest,
} from '@/lib/types/channel.types';
import { apiService } from './api.service';

class ChannelsService {
  async findAll(workspaceSlug: string): Promise<Channel[]> {
    return apiService.request<Channel[]>('GET', SYNAPSE_API_ENDPOINTS.CHANNELS.LIST(workspaceSlug));
  }

  async findOne(workspaceSlug: string, channelId: string): Promise<Channel> {
    return apiService.request<Channel>(
      'GET',
      SYNAPSE_API_ENDPOINTS.CHANNELS.DETAIL(workspaceSlug, channelId),
    );
  }

  async create(workspaceSlug: string, payload: CreateChannelRequest): Promise<Channel> {
    return apiService.request<Channel, CreateChannelRequest>(
      'POST',
      SYNAPSE_API_ENDPOINTS.CHANNELS.CREATE(workspaceSlug),
      payload,
    );
  }

  async update(
    workspaceSlug: string,
    channelId: string,
    payload: UpdateChannelRequest,
  ): Promise<Channel> {
    return apiService.request<Channel, UpdateChannelRequest>(
      'PATCH',
      SYNAPSE_API_ENDPOINTS.CHANNELS.UPDATE(workspaceSlug, channelId),
      payload,
    );
  }

  async remove(workspaceSlug: string, channelId: string): Promise<DeleteChannelResponse> {
    return apiService.request<DeleteChannelResponse>(
      'DELETE',
      SYNAPSE_API_ENDPOINTS.CHANNELS.DELETE(workspaceSlug, channelId),
    );
  }

  async markAsRead(workspaceSlug: string, channelId: string): Promise<{
    channelId: string;
    lastReadMessageId: string | null;
    lastReadAt: string;
    unreadCount: number;
    mentionUnreadCount: number;
  }> {
    return apiService.request(
      'PATCH',
      SYNAPSE_API_ENDPOINTS.CHANNELS.MARK_READ(workspaceSlug, channelId),
    );
  }
}

export const channelsService = new ChannelsService();
