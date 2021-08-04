import type { Clip } from "./clip";
import type { Comment } from "./comment";
import type { User } from "./user";

export interface Notification {
    id: number;
    data: {
        type: "similar" | "upvote" | "downvote" | "reply" | "comment";
        user: User;
        clip: Clip;
        comment?: Comment;
    };
    read_at: Date;
    created_at: Date;
}
