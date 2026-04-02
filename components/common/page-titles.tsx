"use client"
import { useParams,usePathname } from "next/navigation"
import { useChannelDetailsQuery } from "@/hooks/queries/channels/use-channel-details-query"
import { Hash } from "lucide-react"

export function TypographyH2() {
    return (
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            Team Management
        </h2>
    )
}

export function TypographyH3() {
    const params = useParams()
    const slugParam = params?.slug
    const workspaceSlug = typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")
    const channelIdParam = params?.id
    const channelIdSlug = typeof channelIdParam === "string" ? channelIdParam : (channelIdParam?.[0] ?? "")
    const { data: channelDetails, isLoading } = useChannelDetailsQuery(workspaceSlug, channelIdSlug)
    return (
        isLoading ? (
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
        ) : (
            <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-base font-bold text-black">{channelDetails?.name}</h1>
            </div>
        )
    )
}

export default function PageTitles() {
    const pathname = usePathname()
    const isTeamPage = pathname.endsWith("/team")
    const isChannelPage = pathname.includes("/channel/") && !pathname.endsWith("/team")

    if (isTeamPage) {
        return <TypographyH2 />
    }

    if (isChannelPage) {
        return <TypographyH3 />
    }
}