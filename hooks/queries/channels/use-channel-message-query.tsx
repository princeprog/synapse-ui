import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/hooks/use-socket";
import type { Message, MessageReactionGroup } from "@/lib/types/message.types";
import { CHANNELS_QUERY_KEY } from "./useChannelsQuery";

type ToggleReactionResult = {
    messageId: string;
    emoji: string;
    action: "added" | "removed";
    reactions: MessageReactionGroup[];
};

type ReactionsResult = {
    messageId: string;
    reactions: MessageReactionGroup[];
};

type RepliesResult = {
    messageId: string;
    replies: Message[];
};

type ThreadResult = {
    rootMessageId: string;
    thread: Message[];
};

export const useChannelMessageQuery = (
    workspaceSlug: string,
    channelId: string
) => {
    const socket = useSocket();
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const normalizeMessage = (message: Message): Message => ({
        ...message,
        avatarUrl: message.avatarUrl ?? message.avatar_url ?? null,
        reactions: message.reactions ?? [],
        parent_context: message.parent_context ?? null,
        mentioned_user_ids: message.mentioned_user_ids ?? [],
        reply_count: typeof message.reply_count === "number" ? message.reply_count : 0,
        is_pinned: Boolean(message.is_pinned),
        pinned_at: message.pinned_at ?? null,
        pinned_by: message.pinned_by ?? null,
        tags: message.tags ?? [],
        seen_by_count: typeof message.seen_by_count === "number" ? message.seen_by_count : 0,
        seen_by_user_ids: message.seen_by_user_ids ?? [],
        is_deleted: Boolean(message.is_deleted),
    });

    const applyReactionUpdate = (payload: { messageId: string; reactions: MessageReactionGroup[] }) => {
        setMessages((prev) =>
            prev.map((message) =>
                message.id === payload.messageId
                    ? { ...message, reactions: payload.reactions }
                    : message,
            ),
        );
    };

    const refreshMessages = () => {
        if (!socket || !workspaceSlug || !channelId) return;

        socket.emit(
            "messages:history",
            { workspaceSlug, channelId },
            (response: { success: boolean; data?: Message[] }) => {
                if (response.success && response.data) {
                    setMessages(response.data.map(normalizeMessage));
                    setIsLoading(false);
                    return;
                }

                setError("Failed to load messages");
                setIsLoading(false);
            }
        );
    };

    useEffect(() => {
        if (!socket || !workspaceSlug || !channelId) return;

        // Join the channel room
        socket.emit(
            "messages:join",
            { workspaceSlug, channelId },
            (response: { success: boolean; room?: string }) => {
                if (response.success) {
                    console.log(`✅ Joined room: ${response.room}`);
                }
            }
        );

        // Fetch message history
        refreshMessages();

        // Listen for new messages
        const handleMessageCreated = (message: Message) => {
            console.log("📩 New message received:", message);
            setMessages((prev) => [...prev, normalizeMessage(message)]);
            void queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY(workspaceSlug) });
        };

        // Listen for message updates
        const handleMessageUpdated = (message: Message) => {
            console.log("✏️ Message updated:", message);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === message.id
                        ? {
                            ...normalizeMessage(message),
                            reactions: message.reactions ?? msg.reactions ?? [],
                            parent_context: message.parent_context ?? msg.parent_context ?? null,
                        }
                        : msg,
                )
            );
            void queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY(workspaceSlug) });
        };

        // Listen for message deletes
        const handleMessageDeleted = (payload: { id: string }) => {
            console.log("🗑️ Message deleted:", payload.id);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === payload.id
                        ? {
                            ...msg,
                            is_deleted: true,
                            is_edited: false,
                            is_pinned: false,
                            pinned_at: null,
                            pinned_by: null,
                            tags: [],
                            reactions: [],
                        }
                        : msg,
                ),
            );
            void queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY(workspaceSlug) });
        };

        const handleReactionToggled = (payload: ToggleReactionResult) => {
            applyReactionUpdate(payload);
        };

        socket.on("messages:created", handleMessageCreated);
        socket.on("messages:updated", handleMessageUpdated);
        socket.on("messages:deleted", handleMessageDeleted);
        socket.on("messages:reaction:toggled", handleReactionToggled);

        // Cleanup: leave room and remove listeners
        return () => {
            socket.emit("messages:leave", { workspaceSlug, channelId });
            socket.off("messages:created", handleMessageCreated);
            socket.off("messages:updated", handleMessageUpdated);
            socket.off("messages:deleted", handleMessageDeleted);
            socket.off("messages:reaction:toggled", handleReactionToggled);
        };
    }, [socket, workspaceSlug, channelId, queryClient]);

    // Send a new message
    const sendMessage = (content: string, parentId?: string) => {
        if (!socket) return;

        socket.emit(
            "messages:create",
            {
                workspaceSlug,
                channelId,
                dto: { content, parentId },
            },
            (response: { success: boolean; data?: Message }) => {
                if (response.success) {
                    console.log("✅ Message sent:", response.data);
                }
            }
        );
    };

    // Update a message
    const updateMessage = (messageId: string, content: string) => {
        if (!socket) return;

        socket.emit(
            "messages:update",
            {
                workspaceSlug,
                channelId,
                messageId,
                dto: { content },
            },
            (response: { success: boolean; data?: Message }) => {
                if (response.success) {
                    console.log("✅ Message updated:", response.data);
                }
            }
        );
    };

    // Delete a message
    const deleteMessage = (messageId: string) => {
        if (!socket) return;

        socket.emit(
            "messages:delete",
            {
                workspaceSlug,
                channelId,
                messageId,
            },
            (response: { success: boolean }) => {
                if (response.success) {
                    console.log("✅ Message deleted");
                }
            }
        );
    };

    const toggleReaction = (messageId: string, emoji: string) => {
        if (!socket) return;

        socket.emit(
            "messages:reaction:toggle",
            {
                workspaceSlug,
                channelId,
                messageId,
                emoji,
            },
            (response: { success: boolean; data?: ToggleReactionResult }) => {
                if (response.success && response.data) {
                    applyReactionUpdate(response.data);
                    return;
                }

                setError("Failed to update reaction");
            },
        );
    };

    const getMessageReactions = (messageId: string) => {
        if (!socket) return;

        socket.emit(
            "messages:reactions:get",
            {
                workspaceSlug,
                channelId,
                messageId,
            },
            (response: { success: boolean; data?: ReactionsResult }) => {
                if (response.success && response.data) {
                    applyReactionUpdate(response.data);
                }
            },
        );
    };

    const getMessageReplies = (
        messageId: string,
        onSuccess?: (replies: Message[]) => void,
    ) => {
        if (!socket) return;

        socket.emit(
            "messages:replies:get",
            {
                workspaceSlug,
                channelId,
                messageId,
            },
            (response: { success: boolean; data?: RepliesResult }) => {
                if (response.success && response.data) {
                    onSuccess?.(response.data.replies.map(normalizeMessage));
                    return;
                }

                setError("Failed to fetch replies");
            },
        );
    };

    const getMessageThread = (
        messageId: string,
        onSuccess?: (thread: Message[]) => void,
    ) => {
        if (!socket) return;

        socket.emit(
            "messages:thread:get",
            {
                workspaceSlug,
                channelId,
                messageId,
            },
            (response: { success: boolean; data?: ThreadResult }) => {
                if (response.success && response.data) {
                    onSuccess?.(response.data.thread.map(normalizeMessage));
                    return;
                }

                setError("Failed to fetch thread");
            },
        );
    };

    return {
        messages,
        isLoading,
        error,
        refreshMessages,
        sendMessage,
        updateMessage,
        deleteMessage,
        toggleReaction,
        getMessageReactions,
        getMessageReplies,
        getMessageThread,
    };
};