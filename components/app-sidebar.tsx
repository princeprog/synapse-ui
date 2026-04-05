"use client"

import type { ComponentProps } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useParams } from "next/navigation"
import { ChannelCreateModal } from "@/components/workspace/modal/channel-create-modal"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"
import { useLogoutMutation } from "@/hooks/mutation/auth/useLogoutMutation"
import { useProfileQuery } from "@/hooks/queries/auth/useProfileQuery"
import { useWorkspacesQuery } from "@/hooks/queries/workspaces/useWorkspacesQuery"
import { useWorkspaceSidebarChannels } from "@/hooks/useWorkspaceSidebarChannels"
import { useWorkspaceNotificationsSocket } from "@/hooks/workspace/useWorkspaceNotificationsSocket"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BookOpenIcon,
  GalleryVerticalEndIcon,
  LogOutIcon,
  HeartHandshake,
  Users,
  Inbox,
} from "lucide-react"

const LEAVE_WORKSPACE_LINK_CLASSNAME =
  "inline-flex h-8 w-full items-center gap-1.5 rounded-md px-2 text-sm font-medium text-red-500 transition-colors hover:bg-sidebar-accent hover:text-red-600"

export const paramsToExtract = () => {
  const params = useParams()
  const slugParam = params?.slug
  const workspaceSlug = typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")
  return { workspaceSlug }

}

const data = {
  navMain: [
    {
      title: "Welcome",
      url: "#",
      icon: <HeartHandshake />,
    },
    {
      title: "Documentation",
      url: "#",
      icon: <BookOpenIcon />,
    },
    {
      title: "Team",
      url: "team",
      icon: <Users />,
    },
    {
      title: "Inbox",
      url: "#",
      icon: <Inbox />,
    },
  ],
}

function LeaveWorkspaceAction() {
  return (
    <Link href="/workspace" className={LEAVE_WORKSPACE_LINK_CLASSNAME}>
      <LogOutIcon className="size-3.5" />
      Leave Workspace
    </Link>
  )
}

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  useWorkspaceNotificationsSocket()

  const {
    channelItems,
    isLoading,
    isCreating,
    isMutating,
    canCreate,
    channelErrorMessage,
    openCreateModal,
    renameChannel,
    deleteChannel,
    createModalState,
  } = useWorkspaceSidebarChannels()
  const { mutate: logout } = useLogoutMutation()
  const { data: profile } = useProfileQuery()

  const { data: workspaces, isLoading: isWorkspacesLoading } = useWorkspacesQuery()

  const userName =
    profile?.displayName?.trim() ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    profile?.username ||
    "User"
  const userEmail = profile?.email || ""
  const userAvatar = profile?.avatarUrl || ""

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/login")
      },
    })
  }

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          {!isWorkspacesLoading && workspaces && workspaces.length > 0 && (
            <WorkspaceSwitcher
              workspaces={workspaces.map((ws: { name: string; slug: string; plan?: string }) => ({
                name: ws.name,
                slug: ws.slug,
                logo: <GalleryVerticalEndIcon />,
                plan: ws.plan || "-",
              }))}
            />
          )}
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects
            channels={channelItems}
            onCreateChannel={openCreateModal}
            onRenameChannel={renameChannel}
            onDeleteChannel={deleteChannel}
            isCreating={isCreating}
            isMutating={isMutating}
            isLoading={isLoading}
            errorMessage={channelErrorMessage}
            canCreate={canCreate}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: userName,
              email: userEmail,
              avatar: userAvatar,
            }}
            onLogout={handleLogout}
          />
          <LeaveWorkspaceAction />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <ChannelCreateModal {...createModalState} />
    </>
  )
}
