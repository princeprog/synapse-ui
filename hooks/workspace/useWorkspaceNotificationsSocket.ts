"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

import { WORKSPACE_NOTIFICATIONS_QUERY_KEY } from '../queries/workspaces/useWorkspaceNotificationsQuery';
import { WORKSPACES_QUERY_KEY } from '../queries/workspaces/useWorkspacesQuery';

const resolveApiBaseUrl = () => {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (!configured) {
    return 'http://localhost:3000';
  }

  return configured.endsWith('/') ? configured.slice(0, -1) : configured;
};

export const useWorkspaceNotificationsSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(`${resolveApiBaseUrl()}/notifications`, {
      withCredentials: true,
      transports: ['websocket'],
    });
    
    const handleNotificationCreated = () => {
      void queryClient.invalidateQueries({
        queryKey: WORKSPACE_NOTIFICATIONS_QUERY_KEY,
      });
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY });
      void queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'workspaces' &&
          query.queryKey[2] === 'channels',
      });
    };

    socket.on('notification.created', handleNotificationCreated);

    return () => {
      socket.off('notification.created', handleNotificationCreated);
      socket.disconnect();
    };
  }, [queryClient]);
};