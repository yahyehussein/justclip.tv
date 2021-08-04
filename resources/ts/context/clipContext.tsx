import type { Clip } from "../types/clip";
import type { User } from "../types/user";
import { createContext } from "react";

interface ClipContext extends Clip {
  auth?: User;
  emotes?: {
    id: string | number;
    urls: Record<number, string>;
    code: string;
    name: string;
  }[];
}

export const clipContext = createContext<ClipContext>({} as ClipContext);
