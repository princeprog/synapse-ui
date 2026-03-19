import { useQuery } from '@tanstack/react-query';
import { channelsService } from '../../../services/channels.service';

export const CHANNELS_QUERY_KEY = (workspaceSlug: string) =>
  ['workspaces', workspaceSlug, 'channels'] as const;

export const useChannelsQuery = (workspaceSlug: string) => {
  return useQuery({
    queryKey: CHANNELS_QUERY_KEY(workspaceSlug),
    queryFn: () => channelsService.findAll(workspaceSlug),
    enabled: Boolean(workspaceSlug),
  });
};
