import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateChannelRequest } from '@/lib/types/channel.types';
import { channelsService } from '../../../services/channels.service';
import { CHANNELS_QUERY_KEY } from '../../queries/channels/useChannelsQuery';

type UpdateChannelPayload = {
  workspaceSlug: string;
  channelId: string;
  payload: UpdateChannelRequest;
};

export const useUpdateChannelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceSlug, channelId, payload }: UpdateChannelPayload) =>
      channelsService.update(workspaceSlug, channelId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: CHANNELS_QUERY_KEY(variables.workspaceSlug),
      });
    },
  });
};
