import { SYNAPSE_API_ENDPOINTS } from '../constants/api';
import {
  CreateWorkspaceRequest,
  DeleteWorkspaceResponse,
  UpdateWorkspaceRequest,
  Workspace,
} from '@/lib/types/workspace.types';
import {
  DeleteWorkspaceMemberResponse,
  UpdateWorkspaceMemberRoleRequest,
  WorkspaceMember,
} from '@/lib/types/workspace-member.types';
import { apiService } from './api.service';

class WorkspacesService {
  async findAll(): Promise<Workspace[]> {
    return apiService.request<Workspace[]>('GET', SYNAPSE_API_ENDPOINTS.WORKSPACES.LIST);
  }

  async findOne(id: string): Promise<Workspace> {
    return apiService.request<Workspace>('GET', SYNAPSE_API_ENDPOINTS.WORKSPACES.DETAIL(id));
  }

  async create(payload: CreateWorkspaceRequest): Promise<Workspace> {
    return apiService.request<Workspace, CreateWorkspaceRequest>(
      'POST',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.CREATE,
      payload,
    );
  }

  async update(id: string, payload: UpdateWorkspaceRequest): Promise<Workspace> {
    return apiService.request<Workspace, UpdateWorkspaceRequest>(
      'PATCH',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.UPDATE(id),
      payload,
    );
  }

  async remove(id: string): Promise<DeleteWorkspaceResponse> {
    return apiService.request<DeleteWorkspaceResponse>(
      'DELETE',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.DELETE(id),
    );
  }

  async findMembers(workspaceSlug: string): Promise<WorkspaceMember[]> {
    const members = await apiService.request<
      Array<{
        user_id: string;
        username: string;
        email: string;
        role: string;
        joined_at: string;
      }>
    >('GET', SYNAPSE_API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceSlug));

    return members.map((member) => ({
      userId: member.user_id,
      username: member.username,
      email: member.email,
      role: member.role,
      joinedAt: member.joined_at,
    }));
  }

  async updateMemberRole(
    workspaceSlug: string,
    memberId: string,
    payload: UpdateWorkspaceMemberRoleRequest,
  ): Promise<WorkspaceMember> {
    const member = await apiService.request<{
      user_id: string;
      username: string;
      email: string;
      role: string;
      joined_at: string;
    }, UpdateWorkspaceMemberRoleRequest>(
      'PATCH',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.UPDATE_MEMBER_ROLE(workspaceSlug, memberId),
      payload,
    );

    return {
      userId: member.user_id,
      username: member.username,
      email: member.email,
      role: member.role,
      joinedAt: member.joined_at,
    };
  }

  async removeMember(
    workspaceSlug: string,
    memberId: string,
  ): Promise<DeleteWorkspaceMemberResponse> {
    return apiService.request<DeleteWorkspaceMemberResponse>(
      'DELETE',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.REMOVE_MEMBER(workspaceSlug, memberId),
    );
  }
}

export const workspacesService = new WorkspacesService();
