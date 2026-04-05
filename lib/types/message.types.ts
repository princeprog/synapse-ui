
export type MessageReactionActor = {
    user_id: string;
    username: string;
}

export type MessageReactionGroup = {
    emoji: string;
    count: number;
    reactors: MessageReactionActor[];
}

export type MessageParentContext = {
    id: string;
    username: string | null;
    content: string | null;
    exists: boolean;
}

export type Message = {
    id: string;
    channel_id: string;
    sender_id: string;
    parent_id: string | null;
    content: string;
    is_edited: boolean;
    created_at: string | Date;
    username: string;
    reactions: MessageReactionGroup[];
    parent_context: MessageParentContext | null;
    mentioned_user_ids: string[];
    reply_count: number;
}