"use client"
import { useParams } from "next/navigation"
import { useChannelDetailsQuery } from "@/hooks/queries/channels/use-channel-details-query"

export default function PageTitles() {
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
                <span className="text-sm text-muted-foreground">#</span>
                <h1 className="text-base font-bold text-black">{channelDetails?.name}</h1>
            </div>
        )
    )
    
}