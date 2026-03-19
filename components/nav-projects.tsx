"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  HashIcon,
  MoreHorizontalIcon,
  PencilLineIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

export function NavProjects({
  channels,
  onCreateChannel,
  onRenameChannel,
  onDeleteChannel,
  isCreating,
  isMutating,
  isLoading,
  errorMessage,
  canCreate,
}: {
  channels: {
    id: string
    name: string
    url: string
  }[]
  onCreateChannel: () => void
  onRenameChannel: (channel: { id: string; name: string }) => void
  onDeleteChannel: (channel: { id: string; name: string }) => void
  isCreating?: boolean
  isMutating?: boolean
  isLoading?: boolean
  errorMessage?: string | null
  canCreate?: boolean
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Channels</SidebarGroupLabel>
      <SidebarGroupAction
        aria-label="Create channel"
        title="Create channel"
        onClick={onCreateChannel}
        disabled={!canCreate || isCreating}
      >
        <PlusIcon className="size-3.5" />
        <span className="sr-only">Create channel</span>
      </SidebarGroupAction>

      <SidebarMenu>
        {isLoading && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span>Loading channels...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {!isLoading && errorMessage && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span>{errorMessage}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {!isLoading && !errorMessage && channels.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span>No channels yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {channels.map((channel) => (
          <SidebarMenuItem key={channel.id}>
            <SidebarMenuButton asChild>
              <Link href={channel.url}>
                <HashIcon className="text-sidebar-foreground/70" />
                <span>{channel.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="aria-expanded:bg-muted"
                  disabled={isMutating}
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">Channel actions</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-44 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => onRenameChannel(channel)}>
                  <PencilLineIcon className="text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDeleteChannel(channel)}>
                  <Trash2Icon className="text-destructive" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
