import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesService } from "../../../services/workspaces.service";
import { InviteWorkspaceMemberRequest } from "@/lib/types/workspace-member.types";
import { WORKSPACE_MEMBERS_QUERY_KEY } from '../../queries/workspaces/useWorkspaceMembersQuery'
import { PENDING_INVITATIONS_QUERY_KEY } from "../../queries/workspaces/usePendingInvitationsQuery";



export const useInviteMemberMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workspaceSlug, data }: { workspaceSlug: string; data: InviteWorkspaceMemberRequest }) =>
            workspacesService.inviteMember(workspaceSlug, data),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: WORKSPACE_MEMBERS_QUERY_KEY(variables.workspaceSlug) });
            void queryClient.invalidateQueries({ queryKey: PENDING_INVITATIONS_QUERY_KEY(variables.workspaceSlug) });
        },
    })
}