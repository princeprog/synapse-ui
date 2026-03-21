export type WorkspaceNotificationType =
  | 'workspace.invite.created'
  | 'workspace.invite.revoked'
  | 'workspace.invite.accepted'
  | 'workspace.invite.declined';

export interface WorkspaceNotificationWorkspace {
  id: string;
  name: string;
  slug: string;
}

export interface WorkspaceNotificationInvitation {
  id: string;
  email: string | null;
  role: string | null;
  status: string | null;
  expiresAt: string | null;
}

export interface WorkspaceNotification {
  id: string;
  eventId: string;
  type: WorkspaceNotificationType;
  createdAt: string;
  workspace: WorkspaceNotificationWorkspace | null;
  invitation: WorkspaceNotificationInvitation | null;
  message: string;
}

export interface InvitationActionResponse {
  message: string;
  workspaceSlug?: string;
}