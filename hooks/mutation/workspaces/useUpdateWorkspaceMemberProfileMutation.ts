import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesService } from '../../../services/workspaces.service';
import { WORKSPACE_MEMBERS_QUERY_KEY } from '../../queries/workspaces/useWorkspaceMembersQuery';
import type { UpdateWorkspaceMemberProfileRequest } from '@/lib/types/workspace-member.types';

type UpdateWorkspaceMemberProfilePayload = {
  workspaceSlug: string;
  memberId: string;
  payload: UpdateWorkspaceMemberProfileRequest;
};

export const useUpdateWorkspaceMemberProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceSlug, memberId, payload }: UpdateWorkspaceMemberProfilePayload) =>
      workspacesService.updateMemberProfile(workspaceSlug, memberId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: WORKSPACE_MEMBERS_QUERY_KEY(variables.workspaceSlug),
      });
    },
  });
};
