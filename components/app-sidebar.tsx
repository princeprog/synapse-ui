"use client"

import type { ComponentProps } from "react"
import Link from "next/link"

import { ChannelCreateModal } from "@/components/workspace/modal/channel-create-modal"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { useWorkspaceSidebarChannels } from "@/hooks/useWorkspaceSidebarChannels"
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
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
      url: "/workspace/synapse-workspace/team",
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

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
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
