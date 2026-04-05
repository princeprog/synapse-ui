"use client"

import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DEFAULT_REACTIONS, EMOJIS } from "@/constants/emoji"
import { useChannelDetailsQuery } from "@/hooks/queries/channels/use-channel-details-query"
import { useChannelMessageQuery } from "@/hooks/queries/channels/use-channel-message-query"
import { useWorkspaceMembersQuery } from "@/hooks/queries/workspaces/useWorkspaceMembersQuery"
import { authService } from "@/services/auth.service"
import { channelsService } from "@/services/channels.service"
import { Hash, Info, Plus, Search, Send, Smile, AtSign, CornerUpLeft, ChevronDown, ChevronUp } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, FormEvent, useRef, useEffect, useMemo, type ReactNode } from "react"

const MENTION_REGEX = /(@[a-zA-Z0-9_]+)/g

export default function ChannelPage() {
  const params = useParams()
  const slugParam = params?.slug
  const channelIdParam = params?.id
  const workspaceSlug = typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")
  const channelIdSlug = typeof channelIdParam === "string" ? channelIdParam : (channelIdParam?.[0] ?? "")

  const { data: channelDetails, isLoading, error } = useChannelDetailsQuery(workspaceSlug, channelIdSlug)
  const { data: workspaceMembers = [] } = useWorkspaceMembersQuery(workspaceSlug)
  const { data: profile } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => authService.getProfile(),
  })

  const currentUserId = typeof profile?.userId === "string" ? profile.userId : null
  const currentUsername = typeof profile?.username === "string" ? profile.username : null

  const {
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    sendMessage,
    toggleReaction,
  } = useChannelMessageQuery(workspaceSlug, channelIdSlug)

  const groupedMessages: { username: string; messages: typeof messages }[] = []
  messages.forEach((msg) => {
    const prev = groupedMessages[groupedMessages.length - 1]
    if (
      prev &&
      prev.username === msg.username &&
      new Date(msg.created_at).getTime() -
        new Date(prev.messages[prev.messages.length - 1].created_at).getTime() <
        5 * 60 * 1000
    ) {
      prev.messages.push(msg)
    } else {
      groupedMessages.push({
        username: msg.username,
        messages: [msg],
      })
    }
  })

  const childrenByParent = useMemo(() => {
    const map: Record<string, typeof messages> = {}

    for (const message of messages) {
      if (!message.parent_id) {
        continue
      }

      if (!map[message.parent_id]) {
        map[message.parent_id] = []
      }

      map[message.parent_id].push(message)
    }

    return map
  }, [messages])

  const [messageInput, setMessageInput] = useState("")
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [mentionStart, setMentionStart] = useState<number | null>(null)
  const [mentionQuery, setMentionQuery] = useState("")
  const [activeMentionIndex, setActiveMentionIndex] = useState(0)
  const [expandedThreadIds, setExpandedThreadIds] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const replyingToMessage = replyingToId
    ? messages.find((message) => message.id === replyingToId) ?? null
    : null

  const mentionSuggestions = useMemo(() => {
    const normalizedQuery = mentionQuery.trim().toLowerCase()

    return workspaceMembers
      .filter((member) => {
        if (!normalizedQuery) {
          return true
        }

        return member.username.toLowerCase().includes(normalizedQuery)
      })
      .slice(0, 6)
  }, [workspaceMembers, mentionQuery])

  const mentionMenuOpen = mentionStart !== null && mentionSuggestions.length > 0

  const getMentionContext = (value: string, cursorPosition: number) => {
    const mentionSymbolIndex = value.lastIndexOf("@", Math.max(0, cursorPosition - 1))
    if (mentionSymbolIndex < 0) {
      return null
    }

    if (mentionSymbolIndex > 0) {
      const previousCharacter = value[mentionSymbolIndex - 1]
      if (!/\s/.test(previousCharacter)) {
        return null
      }
    }

    const token = value.slice(mentionSymbolIndex + 1, cursorPosition)
    if (/\s/.test(token)) {
      return null
    }

    return {
      start: mentionSymbolIndex,
      query: token,
      cursorPosition,
    }
  }

  const setMentionFromInput = (value: string, cursorPosition: number) => {
    const mentionContext = getMentionContext(value, cursorPosition)

    if (!mentionContext) {
      setMentionStart(null)
      setMentionQuery("")
      setActiveMentionIndex(0)
      return
    }

    setMentionStart(mentionContext.start)
    setMentionQuery(mentionContext.query)
    setActiveMentionIndex(0)
  }

  const selectMention = (username: string) => {
    if (mentionStart === null || !inputRef.current) {
      return
    }

    const cursorPosition = inputRef.current.selectionStart ?? messageInput.length
    const mentionPrefix = messageInput.slice(0, mentionStart + 1)
    const afterMention = messageInput.slice(cursorPosition)
    const nextValue = `${mentionPrefix}${username} ${afterMention}`

    setMessageInput(nextValue)
    setMentionStart(null)
    setMentionQuery("")
    setActiveMentionIndex(0)

    const nextCursorPosition = mentionPrefix.length + username.length + 1
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(nextCursorPosition, nextCursorPosition)
    })
  }

  const toggleThread = (messageId: string) => {
    setExpandedThreadIds((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId],
    )
  }

  const getThreadReplies = (rootMessageId: string) => {
    const descendants: typeof messages = []
    const queue = [...(childrenByParent[rootMessageId] ?? [])]

    while (queue.length > 0) {
      const current = queue.shift()
      if (!current) {
        continue
      }

      descendants.push(current)
      const nextChildren = childrenByParent[current.id] ?? []
      queue.push(...nextChildren)
    }

    return descendants.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
  }

  const renderMessageContent = (content: string): ReactNode[] => {
    return content.split(MENTION_REGEX).map((token, index) => {
      if (!token.startsWith("@")) {
        return <span key={`${token}-${index}`}>{token}</span>
      }

      const isCurrentUserMention =
        Boolean(currentUsername) && token.slice(1).toLowerCase() === currentUsername?.toLowerCase()

      return (
        <span
          key={`${token}-${index}`}
          className={
            isCurrentUserMention
              ? "rounded bg-amber-200/70 px-1 font-semibold text-amber-900"
              : "rounded bg-muted px-1 text-foreground/90"
          }
        >
          {token}
        </span>
      )
    })
  }

  const sendCurrentMessage = () => {
    const content = messageInput.trim()
    if (!content) {
      return
    }

    sendMessage(content, replyingToId ?? undefined)
    setMessageInput("")
    setReplyingToId(null)
    setMentionStart(null)
    setMentionQuery("")
    setActiveMentionIndex(0)
  }

  const insertAtSymbol = () => {
    if (!inputRef.current) {
      return
    }

    const cursorPosition = inputRef.current.selectionStart ?? messageInput.length
    const nextValue =
      messageInput.slice(0, cursorPosition) + "@" + messageInput.slice(cursorPosition)

    setMessageInput(nextValue)

    requestAnimationFrame(() => {
      const nextPosition = cursorPosition + 1
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(nextPosition, nextPosition)
      setMentionFromInput(nextValue, nextPosition)
    })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!workspaceSlug || !channelIdSlug || messagesLoading) {
      return
    }

    const timer = window.setTimeout(() => {
      void channelsService.markAsRead(workspaceSlug, channelIdSlug)
    }, 200)

    return () => {
      window.clearTimeout(timer)
    }
  }, [workspaceSlug, channelIdSlug, messagesLoading, messages.length])

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen flex-1 min-h-0 bg-background relative overflow-hidden">
        <header className="flex items-center justify-between px-4 h-14 border-b shrink-0 absolute top-[-56px] left-0 right-0 z-20 pointer-events-none">
          <div className="flex items-center gap-2 ml-10 pointer-events-auto">
            <Separator orientation="vertical" className="h-4 mr-2" />
            <Hash className="w-5 h-5 text-muted-foreground" />
            {isLoading ? (
              <span className="text-sm text-muted-foreground">Loading...</span>
            ) : error ? (
              <span className="text-sm text-destructive">Error loading channel details</span>
            ) : (
              <h1 className="text-base font-bold text-black">{channelDetails?.name}</h1>
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
                        {new Date(group.messages[0].created_at).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col mt-1 gap-1">
                      {group.messages.map((message) => {
                        const isMentioningCurrentUser =
                          Boolean(currentUserId) &&
                          Array.isArray(message.mentioned_user_ids) &&
                          message.mentioned_user_ids.includes(currentUserId ?? "")

                        const threadReplies = expandedThreadIds.includes(message.id)
                          ? getThreadReplies(message.id)
                          : []

                        return (
                          <div
                            key={message.id}
                            className={
                              "group/message relative rounded-md px-1 py-1 transition-colors hover:bg-muted/40 " +
                              (isMentioningCurrentUser
                                ? "border border-amber-300/70 bg-amber-50/80"
                                : "")
                            }
                          >
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
                                const emoji = EMOJIS[reactionKey]
                                if (!emoji) {
                                  return null
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
                                )
                              })}
                            </div>

                            {message.parent_id && (
                              <div className="mb-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                                <span>↳</span>
                                {message.parent_context?.exists ? (
                                  <span className="truncate">
                                    Replying to <b>@{message.parent_context.username ?? "user"}</b>
                                    {message.parent_context.content
                                      ? `: ${message.parent_context.content}`
                                      : ""}
                                  </span>
                                ) : (
                                  <span className="italic">Original message deleted</span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <p className="text-sm text-foreground/90">{renderMessageContent(message.content)}</p>
                              {message.is_edited && (
                                <span className="text-[10px] text-muted-foreground italic">(edited)</span>
                              )}
                            </div>

                            {!message.parent_id && message.reply_count > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-1 h-6 px-2 text-[11px] text-muted-foreground"
                                onClick={() => toggleThread(message.id)}
                              >
                                {expandedThreadIds.includes(message.id) ? (
                                  <>
                                    <ChevronUp className="mr-1 h-3 w-3" />
                                    Hide replies
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="mr-1 h-3 w-3" />
                                    View {message.reply_count} {message.reply_count === 1 ? "reply" : "replies"}
                                  </>
                                )}
                              </Button>
                            )}

                            {threadReplies.length > 0 && (
                              <div className="mt-2 space-y-1 rounded-md border-l-2 border-muted pl-3">
                                {threadReplies.map((reply) => (
                                  <div key={`thread-${reply.id}`} className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground/90">{reply.username}</span>
                                    <span className="mx-1">:</span>
                                    <span>{reply.content}</span>
                                  </div>
                                ))}
                              </div>
                            )}

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
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

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

          {mentionMenuOpen && (
            <div className="mb-2 max-h-44 overflow-y-auto rounded-md border bg-background p-1 shadow-sm">
              {mentionSuggestions.map((member, index) => (
                <button
                  key={member.userId}
                  type="button"
                  className={
                    "flex w-full items-center rounded px-2 py-1.5 text-left text-sm " +
                    (index === activeMentionIndex ? "bg-muted" : "hover:bg-muted/70")
                  }
                  onMouseDown={(event) => {
                    event.preventDefault()
                    selectMention(member.username)
                  }}
                >
                  <span className="font-medium">@{member.username}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{member.email}</span>
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              sendCurrentMessage()
            }}
          >
            <div className="border rounded-xl bg-background shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-shadow">
              <div className="flex items-center p-2 gap-2">
                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </Button>
                <Input
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => {
                    const value = e.target.value
                    const cursorPosition = e.target.selectionStart ?? value.length
                    setMessageInput(value)
                    setMentionFromInput(value, cursorPosition)
                  }}
                  onKeyDown={(e) => {
                    if (mentionMenuOpen) {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setActiveMentionIndex((prev) =>
                          prev + 1 >= mentionSuggestions.length ? 0 : prev + 1,
                        )
                        return
                      }

                      if (e.key === "ArrowUp") {
                        e.preventDefault()
                        setActiveMentionIndex((prev) =>
                          prev - 1 < 0 ? mentionSuggestions.length - 1 : prev - 1,
                        )
                        return
                      }

                      if ((e.key === "Enter" || e.key === "Tab") && mentionSuggestions[activeMentionIndex]) {
                        e.preventDefault()
                        selectMention(mentionSuggestions[activeMentionIndex].username)
                        return
                      }

                      if (e.key === "Escape") {
                        e.preventDefault()
                        setMentionStart(null)
                        setMentionQuery("")
                        setActiveMentionIndex(0)
                        return
                      }
                    }

                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendCurrentMessage()
                    }
                  }}
                  placeholder={`Message #${channelDetails?.name || "channel"}`}
                  className="flex-1 border-0 focus-visible:ring-0 px-0 h-9 shadow-none text-sm bg-transparent"
                />
                <div className="flex items-center gap-1 pr-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={insertAtSymbol}
                  >
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
  )
}
