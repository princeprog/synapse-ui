import { useMutation, useQueryClient } from '@tanstack/react-query';

import { workspacesService } from '../../../services/workspaces.service';
import { WORKSPACES_QUERY_KEY } from '../../queries/workspaces/useWorkspacesQuery';
import { WORKSPACE_NOTIFICATIONS_QUERY_KEY } from '../../queries/workspaces/useWorkspaceNotificationsQuery';

export const useAcceptWorkspaceInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      workspacesService.acceptInvitation(invitationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY });
      void queryClient.invalidateQueries({
        queryKey: WORKSPACE_NOTIFICATIONS_QUERY_KEY,
      });
    },
  });
};