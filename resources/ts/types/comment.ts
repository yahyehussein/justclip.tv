import type { Clip } from "./clip";
import type { ClipBulletChat } from "./clip-bullet-chat";
import type { Emote } from "./emote";
import type { Report } from "./report";
import type { Roles } from "./roles";
import type { User } from "./user";
import type { Voted } from "./voted";

export interface Comment {
    id: number;
    text: string;
    emotes: Emote[];
    deleted_by: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    upvotes_count: number;
    downvotes_count: number;
    comment_id: number;
    comment: {
        user: User;
    } | null;
    sticky: boolean;
    children: Comment[];
    depth: number;
    user?: User;
    voted: Voted;
    replies: number;
    roles: Roles[];
    report?: Report;
    report_count?: number;
    clip?: Clip;
    in_chat?: ClipBulletChat;
    top_clipper?: boolean;
}
