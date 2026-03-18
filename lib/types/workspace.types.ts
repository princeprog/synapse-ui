export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  role: string;
  memberCount: number;
}

export interface CreateWorkspaceRequest {
  name: string;
  slug?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  slug?: string;
}

export interface DeleteWorkspaceResponse {
  message: string;
}
