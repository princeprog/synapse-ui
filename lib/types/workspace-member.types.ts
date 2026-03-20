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
