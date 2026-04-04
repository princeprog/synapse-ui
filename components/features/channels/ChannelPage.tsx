"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEFAULT_REACTIONS, EMOJIS } from "@/constants/emoji";
import { useChannelDetailsQuery } from "@/hooks/queries/channels/use-channel-details-query";
import { useChannelMessageQuery } from "@/hooks/queries/channels/use-channel-message-query";
import { Hash, Info, Plus, Search, Send, Smile, AtSign, CornerUpLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, FormEvent, useRef, useEffect } from 'react';

export default function ChannelPage() {

    const params = useParams()
    const slugParam = params?.slug
    const channelIdParam = params?.id
    const workspaceSlug = typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")
    const channelIdSlug = typeof channelIdParam === "string" ? channelIdParam : (channelIdParam?.[0] ?? "")

    const { data: channelDetails, isLoading, error } = useChannelDetailsQuery(workspaceSlug, channelIdSlug);

    // WebSocket messages hook
    const {
        messages,
        isLoading: messagesLoading,
        error: messagesError,
        sendMessage,
        toggleReaction,
    } = useChannelMessageQuery(workspaceSlug, channelIdSlug);

    const groupedMessages : { username: string, messages: typeof messages }[] = []

    messages.forEach((msg) => {
        const prev = groupedMessages[groupedMessages.length - 1]
        // Group by username and time (e.g. if within 5 mins of each other)
        if (prev && prev.username === msg.username && new Date(msg.created_at).getTime() - new Date(prev.messages[prev.messages.length - 1].created_at).getTime() < 5 * 60 * 1000) {
            prev.messages.push(msg)
        } else {
            groupedMessages.push({
                username: msg.username,
                messages: [msg]
            })
        }
    })

    const [messageInput, setMessageInput] = useState("");
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const replyingToMessage = replyingToId
        ? messages.find((message) => message.id === replyingToId) ?? null
        : null;

    const sendCurrentMessage = () => {
        const content = messageInput.trim();
        if (!content) return;

        sendMessage(content, replyingToId ?? undefined);
        setMessageInput("");
        setReplyingToId(null);
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <TooltipProvider>
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
                        {groupedMessages.map((group, i) => (
                            <div key={i} className="flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors">
                                <Avatar size="lg">
                                    <AvatarImage src="" />
                                    <AvatarFallback>{group.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{group.username}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(group.messages[0].created_at).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex flex-col mt-1 gap-1">
                                        {group.messages.map((message) => (
                                            <div key={message.id} className="group/message relative rounded-md px-1 py-1 transition-colors hover:bg-muted/40">
                                                <div className="pointer-events-none absolute -top-8 right-0 z-10 flex items-center gap-1 rounded-md border bg-background p-1 opacity-0 shadow-sm transition-opacity group-hover/message:pointer-events-auto group-hover/message:opacity-100">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => setReplyingToId(message.id)}
                                                    >
                                                        <CornerUpLeft className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Separator orientation="vertical" className="h-4" />
                                                    {DEFAULT_REACTIONS.map((reactionKey) => {
                                                        const emoji = EMOJIS[reactionKey];
                                                        if (!emoji) {
                                                            return null;
                                                        }

                                                        return (
                                                            <Button
                                                                key={reactionKey}
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-sm"
                                                                onClick={() => toggleReaction(message.id, emoji)}
                                                            >
                                                                {emoji}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>

                                                {message.parent_id && (
                                                    <div className="mb-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                                                        <span>↳</span>
                                                        {message.parent_context?.exists ? (
                                                            <span className="truncate">
                                                                Replying to
                                                                {" "}
                                                                <b>@{message.parent_context.username ?? "user"}</b>
                                                                {message.parent_context.content ? `: ${message.parent_context.content}` : ""}
                                                            </span>
                                                        ) : (
                                                            <span className="italic">Original message deleted</span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-foreground/90">{message.content}</p>
                                                    {message.is_edited && (
                                                        <span className="text-[10px] text-muted-foreground italic">(edited)</span>
                                                    )}
                                                </div>

                                                {message.reactions.length > 0 && (
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {message.reactions.map((reaction) => (
                                                            <Tooltip key={`${message.id}-${reaction.emoji}`}>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleReaction(message.id, reaction.emoji)}
                                                                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-foreground/90 hover:bg-muted"
                                                                    >
                                                                        <span>{reaction.emoji}</span>
                                                                        <span>{reaction.count}</span>
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" className="max-w-56 text-xs leading-relaxed">
                                                                    {reaction.reactors.length > 0
                                                                        ? reaction.reactors.map((reactor) => reactor.username).join(", ")
                                                                        : "No reactions yet"}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Message Input Area */}
            <div className="px-4 pb-4 shrink-0">
                {replyingToId && (
                    <div className="mb-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <div className="flex items-start justify-between gap-2">
                            <span className="truncate">
                                {replyingToMessage
                                    ? `Replying to @${replyingToMessage.username}: ${replyingToMessage.content}`
                                    : "Replying to original message deleted"}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => setReplyingToId(null)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
                <form onSubmit={(e: FormEvent) => {
                    e.preventDefault();
                    sendCurrentMessage();
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
                                        sendCurrentMessage();
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
        </TooltipProvider>
    );
}
