import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateChannelRequest } from '@/lib/types/channel.types';
import { channelsService } from '../../../services/channels.service';
import { CHANNELS_QUERY_KEY } from '../../queries/channels/useChannelsQuery';

type CreateChannelPayload = {
  workspaceSlug: string;
  payload: CreateChannelRequest;
};

export const useCreateChannelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceSlug, payload }: CreateChannelPayload) =>
      channelsService.create(workspaceSlug, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: CHANNELS_QUERY_KEY(variables.workspaceSlug),
      });
    },
  });
};
