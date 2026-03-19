import { useMutation, useQueryClient } from '@tanstack/react-query';
import { channelsService } from '../../../services/channels.service';
import { CHANNELS_QUERY_KEY } from '../../queries/channels/useChannelsQuery';

type DeleteChannelPayload = {
  workspaceSlug: string;
  channelId: string;
};

export const useDeleteChannelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceSlug, channelId }: DeleteChannelPayload) =>
      channelsService.remove(workspaceSlug, channelId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: CHANNELS_QUERY_KEY(variables.workspaceSlug),
      });
    },
  });
};
