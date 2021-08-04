import type { User } from "./user";

export interface Report {
    id: number;
    report: {
        type?: "clip" | "comment" | "bullet chat";
        from: User;
        rule: string;
    };
}
