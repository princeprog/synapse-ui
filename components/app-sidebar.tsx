"use client"

import type { ComponentProps } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChannelCreateModal } from "@/components/workspace/modal/channel-create-modal"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"
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
  AudioLinesIcon,
  BookOpenIcon,
  GalleryVerticalEndIcon,
  LogOutIcon,
  
  TerminalIcon,
  TerminalSquareIcon,
  ClipboardList,
  Gauge,
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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

  const { data: workspaces, isLoading: isWorkspacesLoading } = useWorkspacesQuery()

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
          <NavUser user={data.user} />
          <LeaveWorkspaceAction />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <ChannelCreateModal {...createModalState} />
    </>
  )
}
