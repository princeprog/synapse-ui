"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react"


export function WorkspaceSwitcher({
  workspaces,
}: {
  workspaces: {
    name: string
    slug: string
    logo: React.ReactNode
    plan: string
  }[]
}) {

  const { isMobile } = useSidebar()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = React.useState(false)
  // Extract slug from /workspace/[slug] or fallback to first
  const slugMatch = pathname?.match(/\/workspace\/([^\/]+)/)
  const currentSlug = slugMatch ? decodeURIComponent(slugMatch[1]) : workspaces[0]?.slug
  const activeWorkspace = workspaces.find(w => w.slug === currentSlug) || workspaces[0]

  if (!activeWorkspace) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" +
                (isLoading ? " opacity-60 pointer-events-none" : "")
              }
              disabled={isLoading}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeWorkspace.logo}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeWorkspace.name}</span>
                <span className="truncate text-xs">{activeWorkspace.plan}</span>
              </div>
              {isLoading ? (
                <svg className="ml-auto animate-spin h-4 w-4 text-muted-foreground" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <ChevronsUpDownIcon className="ml-auto" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.slug}
                onClick={() => {
                  if (workspace.slug !== activeWorkspace.slug) {
                    setIsLoading(true)
                    if (typeof window !== 'undefined') {
                      window.location.href = `/workspace/${encodeURIComponent(workspace.slug)}`
                    }
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {workspace.logo}
                </div>
                {workspace.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
