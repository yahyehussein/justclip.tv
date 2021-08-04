import { Category } from "./category";
import { User } from "./user";

export interface Leaderboard {
    id: number;
    current_points: number;
    previous_points: number;
    user: User;
    broadcaster: User;
    category: Category;
}
