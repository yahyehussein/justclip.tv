import { Report } from "./report";
import { Roles } from "./roles";

export interface User {
    id: number;
    login: string;
    display_name: string;
    avatar: string;
    avatar_frame?: string;
    banner?: string;
    about?: string;
    background?: {
        image: string;
        video: string;
    };
    mini_background?: string;
    clip_upvotes_count: number;
    clip_downvotes_count: number;
    comment_upvotes_count: number;
    comment_downvotes_count: number;
    roles?: Roles[];
    partner: boolean;
    access_token?: string;
    type?: string;
    title?: string;
    category?: string;
    started_at?: Date;
    followers_count?: number;
    blocked_broadcasters?: number[];
    blocked_categories?: number[];
    report?: Report;
    report_count?: number;
    notify_comments?: boolean;
    notify_replies?: boolean;
    subscriptions?: {
        channel_update: string;
        stream_online: string;
        stream_offline: string;
    };
    votes?: number;
}
