import type { User } from "./types/user";
import type { Flash } from "./types/flash";

declare module "@inertiajs/inertia" {
    interface PageProps {
        auth?: User;
        flash: Flash;
        errors: Record<string, unknown>;
    }
}
