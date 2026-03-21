import { SYNAPSE_API_ENDPOINTS } from '../constants/api';
import {
  CreateWorkspaceRequest,
  DeleteWorkspaceResponse,
  UpdateWorkspaceRequest,
  Workspace,
} from '@/lib/types/workspace.types';
import {
  DeleteWorkspaceInvitationResponse,
  DeleteWorkspaceMemberResponse,
  InviteWorkspaceMemberRequest,
  UpdateWorkspaceMemberRoleRequest,
  WorkspaceInvitation,
  WorkspaceMember,
} from '@/lib/types/workspace-member.types';
import {
  InvitationActionResponse,
  WorkspaceNotification,
} from '@/lib/types/notification.types';
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

  async inviteMember(
    workspaceSlug: string,
    payload: InviteWorkspaceMemberRequest,
  ): Promise<void> {
    await apiService.request<void, InviteWorkspaceMemberRequest>(
      'POST',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.INVITE_MEMBER(workspaceSlug),
      payload,
    );
  }

  async findPendingInvitations(workspaceSlug: string): Promise<WorkspaceInvitation[]> {
    const invitations = await apiService.request<
      Array<{
        id: string;
        email: string;
        role: string;
        status: string;
        expires_at: string;
        accepted_at: string | null;
      }>
    >('GET', SYNAPSE_API_ENDPOINTS.WORKSPACES.INVITATIONS(workspaceSlug));

    return invitations.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expires_at,
      acceptedAt: invitation.accepted_at,
    }));
  }

  async revokeInvitation(
    workspaceSlug: string,
    invitationId: string,
  ): Promise<DeleteWorkspaceInvitationResponse> {
    return apiService.request<DeleteWorkspaceInvitationResponse>(
      'DELETE',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.INVITATION_DETAIL(
        workspaceSlug,
        invitationId,
      ),
    );
  }

  async findMyNotifications(): Promise<WorkspaceNotification[]> {
    return apiService.request<WorkspaceNotification[]>(
      'GET',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.MY_NOTIFICATIONS,
    );
  }

  async findMyInvitations(): Promise<WorkspaceInvitation[]> {
    const invitations = await apiService.request<
      Array<{
        id: string;
        email: string;
        role: string;
        status: string;
        expiresAt: string;
        acceptedAt: string | null;
      }>
    >('GET', SYNAPSE_API_ENDPOINTS.WORKSPACES.MY_INVITATIONS);

    return invitations.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
    }));
  }

  async acceptInvitation(
    invitationId: string,
  ): Promise<InvitationActionResponse> {
    return apiService.request<InvitationActionResponse>(
      'POST',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.ACCEPT_INVITATION(invitationId),
    );
  }

  async declineInvitation(
    invitationId: string,
  ): Promise<InvitationActionResponse> {
    return apiService.request<InvitationActionResponse>(
      'POST',
      SYNAPSE_API_ENDPOINTS.WORKSPACES.DECLINE_INVITATION(invitationId),
    );
  }
}

export const workspacesService = new WorkspacesService();
