import type { Category } from "./category";
import { Comment } from "./comment";
import { Report } from "./report";
import type { User } from "./user";
import type { Voted } from "./voted";

export interface Clip {
    id: number;
    slug: string;
    title: string;
    thumbnail: string;
    duration: number;
    offset: number;
    out_of_context: boolean;
    locked: boolean;
    mirror: string;
    spoiler: boolean;
    tos: boolean;
    hearted: boolean;
    video_id: number;
    deleted_at: Date;
    created_at: Date;
    upvotes_count: number;
    downvotes_count: number;
    user_id: number;
    broadcaster_id: number;
    notify_comments: boolean;
    comments: Comment[];
    comments_count: number;
    user?: User;
    broadcaster: User;
    category?: Category;
    voted: Voted;
    views_count?: number;
    report?: Report;
    report_count?: number;
    next?: Clip;
    deleted_by?: {
        rule: string;
    };
}
