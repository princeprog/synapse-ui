import { SYNAPSE_API_ENDPOINTS } from '../constants/api';
import {
  CreateWorkspaceRequest,
  DeleteWorkspaceResponse,
  UpdateWorkspaceRequest,
  Workspace,
} from '@/lib/types/workspace.types';
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
}

export const workspacesService = new WorkspacesService();
