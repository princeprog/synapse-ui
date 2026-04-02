import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/use-socket";

export type Message = {
    id: string;
    channel_id: string;
    sender_id: string;
    parent_id: string | null;
    content: string;
    is_edited: boolean;
    created_at: Date;
    username: string;
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
        socket.emit(
            "messages:history",
            { workspaceSlug, channelId },
            (response: { success: boolean; data?: Message[] }) => {
                if (response.success && response.data) {
                    setMessages(response.data);
                    setIsLoading(false);
                } else {
                    setError("Failed to load messages");
                    setIsLoading(false);
                }
            }
        );

        // Listen for new messages
        const handleMessageCreated = (message: Message) => {
            console.log("📩 New message received:", message);
            setMessages((prev) => [...prev, message]);
        };

        // Listen for message updates
        const handleMessageUpdated = (message: Message) => {
            console.log("✏️ Message updated:", message);
            setMessages((prev) =>
                prev.map((msg) => (msg.id === message.id ? message : msg))
            );
        };

        // Listen for message deletes
        const handleMessageDeleted = (payload: { id: string }) => {
            console.log("🗑️ Message deleted:", payload.id);
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.id));
        };

        socket.on("messages:created", handleMessageCreated);
        socket.on("messages:updated", handleMessageUpdated);
        socket.on("messages:deleted", handleMessageDeleted);

        // Cleanup: leave room and remove listeners
        return () => {
            socket.emit("messages:leave", { workspaceSlug, channelId });
            socket.off("messages:created", handleMessageCreated);
            socket.off("messages:updated", handleMessageUpdated);
            socket.off("messages:deleted", handleMessageDeleted);
        };
    }, [socket, workspaceSlug, channelId]);

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

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        updateMessage,
        deleteMessage,
    };
};