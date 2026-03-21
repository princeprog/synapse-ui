import { useMutation, useQueryClient } from '@tanstack/react-query';

import { workspacesService } from '../../../services/workspaces.service';
import { PENDING_INVITATIONS_QUERY_KEY } from '../../queries/workspaces/usePendingInvitationsQuery';

type RevokeWorkspaceInvitationPayload = {
  workspaceSlug: string;
  invitationId: string;
};

export const useRevokeWorkspaceInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceSlug, invitationId }: RevokeWorkspaceInvitationPayload) =>
      workspacesService.revokeInvitation(workspaceSlug, invitationId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: PENDING_INVITATIONS_QUERY_KEY(variables.workspaceSlug),
      });
    },
  });
};
