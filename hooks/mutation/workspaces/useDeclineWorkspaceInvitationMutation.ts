import { useMutation, useQueryClient } from '@tanstack/react-query';

import { workspacesService } from '../../../services/workspaces.service';
import { WORKSPACE_NOTIFICATIONS_QUERY_KEY } from '../../queries/workspaces/useWorkspaceNotificationsQuery';

export const useDeclineWorkspaceInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      workspacesService.declineInvitation(invitationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: WORKSPACE_NOTIFICATIONS_QUERY_KEY,
      });
    },
  });
};