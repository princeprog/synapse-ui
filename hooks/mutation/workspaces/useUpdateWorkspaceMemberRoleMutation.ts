import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateWorkspaceMemberRoleRequest } from '@/lib/types/workspace-member.types';
import { workspacesService } from '../../../services/workspaces.service';
import { WORKSPACE_MEMBERS_QUERY_KEY } from '../../queries/workspaces/useWorkspaceMembersQuery';

type UpdateWorkspaceMemberRolePayload = {
  workspaceSlug: string;
  memberId: string;
  payload: UpdateWorkspaceMemberRoleRequest;
};

export const useUpdateWorkspaceMemberRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceSlug, memberId, payload }: UpdateWorkspaceMemberRolePayload) =>
      workspacesService.updateMemberRole(workspaceSlug, memberId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: WORKSPACE_MEMBERS_QUERY_KEY(variables.workspaceSlug),
      });
    },
  });
};
