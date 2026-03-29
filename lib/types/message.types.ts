
export type Message = {
    id: string;
    channel_id: string;
    sender_id: string;
    parent_id: string | null;
    content: string;
    is_edited: boolean;
    created_at: string;
}