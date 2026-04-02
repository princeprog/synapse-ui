"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useChannelDetailsQuery } from "@/hooks/queries/channels/use-channel-details-query";
import { useChannelMessageQuery } from "@/hooks/queries/channels/use-channel-message-query";
import { Hash, Info, Plus, Search, Send, Smile, AtSign } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, FormEvent, useRef, useEffect } from 'react';

export default function ChannelPage() {

    const params = useParams()
    const slugParam = params?.slug
    const channelIdParam = params?.id
    const workspaceSlug = typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")
    const channelIdSlug = typeof channelIdParam === "string" ? channelIdParam : (channelIdParam?.[0] ?? "")

    const { data: channelDetails, isLoading, error, isSuccess } = useChannelDetailsQuery(workspaceSlug, channelIdSlug);

    // WebSocket messages hook
    const {
        messages,
        isLoading: messagesLoading,
        error: messagesError,
        sendMessage
    } = useChannelMessageQuery(workspaceSlug, channelIdSlug);

    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen flex-1 min-h-0 bg-background relative overflow-hidden">

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
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-muted-foreground">Loading messages...</span>
                    </div>
                ) : messagesError ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-destructive">{messagesError}</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                            <Hash className="w-12 h-12 text-muted-foreground mx-auto" />
                            <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <div key={message.id} className="flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors">
                                <Avatar size="lg">
                                    <AvatarImage src="" />
                                    <AvatarFallback>{message.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{message.username}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(message.created_at).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </span>
                                        {message.is_edited && (
                                            <span className="text-[10px] text-muted-foreground italic">(edited)</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground/90">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Message Input Area */}
            <div className="px-4 pb-4 shrink-0">
                <form onSubmit={(e: FormEvent) => {
                    e.preventDefault();
                    if (!messageInput.trim()) return;
                    sendMessage(messageInput);
                    setMessageInput("");
                }}>
                    <div className="border rounded-xl bg-background shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-shadow">
                        <div className="flex items-center p-2 gap-2">
                            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Input
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (!messageInput.trim()) return;
                                        sendMessage(messageInput);
                                        setMessageInput("");
                                    }
                                }}
                                placeholder={`Message #${channelDetails?.name || 'channel'}`}
                                className="flex-1 border-0 focus-visible:ring-0 px-0 h-9 shadow-none text-sm bg-transparent"
                            />
                            <div className="flex items-center gap-1 pr-1">
                                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <AtSign className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <Smile className="h-4 w-4" />
                                </Button>
                                <Separator orientation="vertical" className="h-4 mx-1" />
                                <Button type="submit" size="icon" className="rounded-md bg-primary text-primary-foreground">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
                <p className="text-[10px] text-center mt-2 text-muted-foreground">
                    <b>Return</b> to send, <b>Shift + Return</b> for new line
                </p>
            </div>
        </div>
    );
}
