import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesService } from '../../../services/workspaces.service';
import { WORKSPACES_QUERY_KEY } from '../../queries/workspaces/useWorkspacesQuery';
import { UpdateWorkspaceRequest } from '@/lib/types/workspace.types';

type UpdateWorkspacePayload = {
  id: string;
  payload: UpdateWorkspaceRequest;
};

export const useUpdateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateWorkspacePayload) =>
      workspacesService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY });
    },
  });
};
