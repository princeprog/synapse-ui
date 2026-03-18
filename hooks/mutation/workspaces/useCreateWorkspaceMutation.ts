import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesService } from '../../../services/workspaces.service';
import { WORKSPACES_QUERY_KEY } from '../../queries/workspaces/useWorkspacesQuery';

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workspacesService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY });
    },
  });
};
