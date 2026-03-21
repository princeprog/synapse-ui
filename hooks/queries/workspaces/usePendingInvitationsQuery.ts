import { useQuery } from '@tanstack/react-query';

import { workspacesService } from '../../../services/workspaces.service';

export const PENDING_INVITATIONS_QUERY_KEY = (workspaceSlug: string) =>
  ['workspaces', workspaceSlug, 'invitations', 'pending'] as const;

export const usePendingInvitationsQuery = (workspaceSlug: string) => {
  return useQuery({
    queryKey: PENDING_INVITATIONS_QUERY_KEY(workspaceSlug),
    queryFn: () => workspacesService.findPendingInvitations(workspaceSlug),
    enabled: Boolean(workspaceSlug),
  });
};
