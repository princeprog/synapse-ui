"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useChannelDetailsQuery } from "@/hooks/queries/channels/use-channel-details-query";
import { Hash, Info, Plus, Search, Send, Smile, AtSign } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from 'react';
export default function ChannelPage() {

    const params = useParams()
    const slugParam = params?.slug
    const channelIdParam = params?.id
    const workspaceSlug = typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")
    const channelIdSlug = typeof channelIdParam === "string" ? channelIdParam : (channelIdParam?.[0] ?? "")

    const { data: channelDetails, isLoading, error, isSuccess } = useChannelDetailsQuery(workspaceSlug, channelIdSlug);

    return (
        <div className="flex flex-col h-full flex-1 min-h-0 bg-background relative">

            {/* Header Overlay - Adjusted to align with layout's SidebarTrigger */}
            <header className="flex items-center justify-between px-4 h-14 border-b shrink-0 absolute top-[-56px] left-0 right-0 z-20 pointer-events-none">
                <div className="flex items-center gap-2 ml-10 pointer-events-auto">
                    <Separator orientation="vertical" className="h-4 mr-2" />
                    <Hash className="w-5 h-5 text-muted-foreground" />
                    {isLoading ? (
                        <span className="text-sm text-muted-foreground">Loading...</span>
                    ) : error ? (
                        <span className="text-sm text-destructive">Error loading channel details</span>
                    ) : (
                        <h1 className="text-base font-bold text-black"> {channelDetails?.name}</h1>
                    )}
                </div>
                <div className="flex items-center gap-2 pointer-events-auto">
                    <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 border-3">
                {/* Date Separator */}
                <div className="relative flex items-center py-4">
                    <Separator className="flex-1" />
                    <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        March 28th, 2026
                    </span>
                </div>

                {/* Mock Messages */}
                <div className="flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors">
                    <Avatar size="lg">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">John Doe</span>
                            <span className="text-[10px] text-muted-foreground">12:34 PM</span>
                        </div>
                        <p className="text-sm text-foreground/90">Hey team! I've just finished the initial layout for the channel page. What do you think?</p>
                    </div>
                </div>

                <div className="flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors">
                    <Avatar size="lg">
                        <AvatarImage src="" />
                        <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">Alice Smith</span>
                            <span className="text-[10px] text-muted-foreground">12:36 PM</span>
                        </div>
                        <p className="text-sm text-foreground/90">It looks great! Very clean and matches the rest of the workspace. 🚀</p>
                    </div>
                </div>

                <div className="flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors">
                    <Avatar size="lg">
                        <AvatarImage src="https://github.com/nutlope.png" />
                        <AvatarFallback>HM</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">Hassan M.</span>
                            <span className="text-[10px] text-muted-foreground">12:40 PM</span>
                        </div>
                        <div className="text-sm text-foreground/90 space-y-2">
                            <p>I agree. We should make sure it's fully responsive though.</p>
                            <div className="bg-muted/50 border rounded-md p-3 max-w-sm mt-2">
                                <p className="text-xs font-medium mb-1 flex items-center gap-2">
                                    <Plus className="h-3 w-3" /> attachment_spec.pdf
                                </p>
                                <p className="text-[10px] text-muted-foreground">2.4 MB • PDF Document</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Input Area */}
            <div className="px-4 pb-4 shrink-0">
                <div className="border rounded-xl bg-background shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-shadow">
                    <div className="flex items-center p-2 gap-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Input
                            placeholder="Message #general"
                            className="flex-1 border-0 focus-visible:ring-0 px-0 h-9 shadow-none text-sm bg-transparent"
                        />
                        <div className="flex items-center gap-1 pr-1">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <AtSign className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Smile className="h-4 w-4" />
                            </Button>
                            <Separator orientation="vertical" className="h-4 mx-1" />
                            <Button size="icon" className="rounded-md bg-primary text-primary-foreground">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground">
                    <b>Return</b> to send, <b>Shift + Return</b> for new line
                </p>
            </div>
        </div>
    );
}