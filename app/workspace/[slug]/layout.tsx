
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import PageTitles from "@/components/common/page-titles"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 px-4 border-b">
                    <SidebarTrigger className="-ml-1 border-3" />
                    <PageTitles />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}