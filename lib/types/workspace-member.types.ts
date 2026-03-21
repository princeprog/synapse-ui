export interface WorkspaceMember {
  userId: string;
  username: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface UpdateWorkspaceMemberRoleRequest {
  role: 'Admin' | 'Member';
}

export interface DeleteWorkspaceMemberResponse {
  message: string;
}

export interface InviteWorkspaceMemberRequest {
  email: string;
  role: 'Admin' | 'Member';
}

export interface WorkspaceInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  acceptedAt: string | null;
}

export interface DeleteWorkspaceInvitationResponse {
  message: string;
}
