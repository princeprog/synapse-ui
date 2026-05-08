import { useQuery } from '@tanstack/react-query';
import { workspacesService } from '../../../services/workspaces.service';

export const WORKSPACES_QUERY_KEY = ['workspaces'];

export const useWorkspacesQuery = (enabled = true) => {
  return useQuery({
    queryKey: WORKSPACES_QUERY_KEY,
    queryFn: () => workspacesService.findAll(),
    enabled,
  });
};
