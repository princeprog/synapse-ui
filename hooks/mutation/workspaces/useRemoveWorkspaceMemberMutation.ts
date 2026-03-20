import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesService } from '../../../services/workspaces.service';
import { WORKSPACE_MEMBERS_QUERY_KEY } from '../../queries/workspaces/useWorkspaceMembersQuery';

type RemoveWorkspaceMemberPayload = {
  workspaceSlug: string;
  memberId: string;
};

export const useRemoveWorkspaceMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceSlug, memberId }: RemoveWorkspaceMemberPayload) =>
      workspacesService.removeMember(workspaceSlug, memberId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: WORKSPACE_MEMBERS_QUERY_KEY(variables.workspaceSlug),
      });
    },
  });
};
