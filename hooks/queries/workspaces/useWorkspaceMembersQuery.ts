import { useQuery } from '@tanstack/react-query';
import { workspacesService } from '../../../services/workspaces.service';

export const WORKSPACE_MEMBERS_QUERY_KEY = (workspaceSlug: string) =>
  ['workspaces', workspaceSlug, 'members'] as const;

export const useWorkspaceMembersQuery = (workspaceSlug: string) => {
  return useQuery({
    queryKey: WORKSPACE_MEMBERS_QUERY_KEY(workspaceSlug),
    queryFn: () => workspacesService.findMembers(workspaceSlug),
    enabled: Boolean(workspaceSlug),
  });
};
