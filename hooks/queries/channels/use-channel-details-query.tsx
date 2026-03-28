import { channelsService } from "../../../services/channels.service"
import { useQuery } from "@tanstack/react-query"


export const useChannelDetailsQuery = (workspaceSlug: string, channelId: string) => {
    return useQuery({
        queryKey: ['workspaces', workspaceSlug, 'channels', channelId] as const,
        queryFn: () => channelsService.findOne(workspaceSlug, channelId),
        enabled: Boolean(workspaceSlug) && Boolean(channelId),
    })
}