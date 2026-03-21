import { useQuery } from '@tanstack/react-query';

import { workspacesService } from '../../../services/workspaces.service';

export const WORKSPACE_NOTIFICATIONS_QUERY_KEY = [
  'workspaces',
  'notifications',
  'me',
] as const;

export const useWorkspaceNotificationsQuery = () => {
  return useQuery({
    queryKey: WORKSPACE_NOTIFICATIONS_QUERY_KEY,
    queryFn: () => workspacesService.findMyNotifications(),
  });
};