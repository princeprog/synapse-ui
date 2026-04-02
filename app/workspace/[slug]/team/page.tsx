"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { createColumns, TeamMember } from "./columns"
import { DataTable } from "./data-table"
import { createPendingInviteColumns, PendingInvite } from "./pending-invites-columns"
import { useWorkspaceMembersQuery } from "@/hooks/queries/workspaces/useWorkspaceMembersQuery"
import { usePendingInvitationsQuery } from "@/hooks/queries/workspaces/usePendingInvitationsQuery"
import { useUpdateWorkspaceMemberRoleMutation } from "@/hooks/mutation/workspaces/useUpdateWorkspaceMemberRoleMutation"
import { useRemoveWorkspaceMemberMutation } from "@/hooks/mutation/workspaces/useRemoveWorkspaceMemberMutation"
import { useRevokeWorkspaceInvitationMutation } from "@/hooks/mutation/workspaces/useRevokeWorkspaceInvitationMutation"

function getNextRole(role: string): "Admin" | "Member" {
  return role.toLowerCase() === "admin" ? "Member" : "Admin"
}

export default function TeamPage() {
  const params = useParams()
  const slugParam = params?.slug
  const workspaceSlug =
    typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")

  const { data = [], isLoading, error } = useWorkspaceMembersQuery(workspaceSlug)
  const {
    data: pendingInvitations = [],
    isLoading: isLoadingInvitations,
    error: pendingInvitationsError,
  } = usePendingInvitationsQuery(workspaceSlug)
  const { mutate: updateMemberRole, isPending: isUpdatingRole } = useUpdateWorkspaceMemberRoleMutation()
  const { mutate: removeMember, isPending: isRemovingMember } = useRemoveWorkspaceMemberMutation()
  const { mutate: revokeInvitation, isPending: isRevokingInvitation } = useRevokeWorkspaceInvitationMutation()

  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)

  const tableData = useMemo<TeamMember[]>(
    () =>
      data.map((member) => ({
        userId: member.userId,
        username: member.username,
        email: member.email,
        role: member.role,
        joinedAt: member.joinedAt,
      })),
    [data],
  )

  const pendingInviteData = useMemo<PendingInvite[]>(
    () =>
      pendingInvitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
      })),
    [pendingInvitations],
  )

  const handleToggleRole = (member: TeamMember) => {
    if (!workspaceSlug || isUpdatingRole) {
      return
    }

    const nextRole = getNextRole(member.role)
    const confirmed = window.confirm(
      `Set ${member.username}'s role to ${nextRole}?`,
    )

    if (!confirmed) {
      return
    }

    setActionErrorMessage(null)
    updateMemberRole(
      {
        workspaceSlug,
        memberId: member.userId,
        payload: { role: nextRole },
      },
      {
        onError: (mutationError) => {
          setActionErrorMessage(mutationError.message)
        },
      },
    )
  }

  const handleRemoveMember = (member: TeamMember) => {
    if (!workspaceSlug || isRemovingMember) {
      return
    }

    const confirmed = window.confirm(`Remove ${member.username} from this workspace?`)

    if (!confirmed) {
      return
    }

    setActionErrorMessage(null)
    removeMember(
      {
        workspaceSlug,
        memberId: member.userId,
      },
      {
        onError: (mutationError) => {
          setActionErrorMessage(mutationError.message)
        },
      },
    )
  }

  const columns = createColumns({
    onToggleRole: handleToggleRole,
    onRemove: handleRemoveMember,
  })

  const handleRevokeInvitation = (invitation: PendingInvite) => {
    if (!workspaceSlug || isRevokingInvitation) {
      return
    }

    const confirmed = window.confirm(`Revoke invitation for ${invitation.email}?`)

    if (!confirmed) {
      return
    }

    setActionErrorMessage(null)
    revokeInvitation(
      {
        workspaceSlug,
        invitationId: invitation.id,
      },
      {
        onError: (mutationError) => {
          setActionErrorMessage(mutationError.message)
        },
      },
    )
  }

  const pendingInviteColumns = createPendingInviteColumns({
    onRevoke: handleRevokeInvitation,
  })

  const queryErrorMessage = error instanceof Error ? error.message : null
  const pendingQueryErrorMessage =
    pendingInvitationsError instanceof Error ? pendingInvitationsError.message : null
  const errorMessage = actionErrorMessage ?? queryErrorMessage ?? pendingQueryErrorMessage

  return (
    <div className="container mx-auto px-4">
      {errorMessage ? (
        <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <DataTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        filterColumnId="email"
        filterPlaceholder="Filter members by email..."
        loadingMessage="Loading members..."
        emptyMessage="No members found."
      />

      <div className="mt-10">
        <h3 className="text-xl font-semibold tracking-tight">Pending Invitations</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage invitations that have not been accepted yet.
        </p>
        <DataTable
          columns={pendingInviteColumns}
          data={pendingInviteData}
          isLoading={isLoadingInvitations}
          filterColumnId="email"
          filterPlaceholder="Filter pending invites by email..."
          loadingMessage="Loading pending invitations..."
          emptyMessage="No pending invitations."
        />
      </div>
    </div>
  )
}