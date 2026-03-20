"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { createColumns, TeamMember } from "./columns"
import { DataTable } from "./data-table"
import { useWorkspaceMembersQuery } from "@/hooks/queries/workspaces/useWorkspaceMembersQuery"
import { useUpdateWorkspaceMemberRoleMutation } from "@/hooks/mutation/workspaces/useUpdateWorkspaceMemberRoleMutation"
import { useRemoveWorkspaceMemberMutation } from "@/hooks/mutation/workspaces/useRemoveWorkspaceMemberMutation"

function getNextRole(role: string): "Admin" | "Member" {
  return role.toLowerCase() === "admin" ? "Member" : "Admin"
}

export function TypographyH2() {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      Team Management
    </h2>
  )
}

export default function TeamPage() {
  const params = useParams()
  const slugParam = params?.slug
  const workspaceSlug =
    typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")

  const { data = [], isLoading, error } = useWorkspaceMembersQuery(workspaceSlug)
  const { mutate: updateMemberRole, isPending: isUpdatingRole } = useUpdateWorkspaceMemberRoleMutation()
  const { mutate: removeMember, isPending: isRemovingMember } = useRemoveWorkspaceMemberMutation()

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

  const queryErrorMessage = error instanceof Error ? error.message : null
  const errorMessage = actionErrorMessage ?? queryErrorMessage

  return (
    <div className="container mx-auto px-4">
      <TypographyH2 />
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
      />
    </div>
  )
}