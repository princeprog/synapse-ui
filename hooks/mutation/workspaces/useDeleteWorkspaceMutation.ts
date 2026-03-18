import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesService } from '../../../services/workspaces.service';
import { WORKSPACES_QUERY_KEY } from '../../queries/workspaces/useWorkspacesQuery';

export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workspacesService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY });
    },
  });
};
