import { create } from "zustand";
import type { POST } from "../vite-env";

interface POSTSTORE {
  posts: POST[];
  addPosts: (post: POST[]) => void;
}

export const usePostStore = create<POSTSTORE>((set) => ({
  posts: [],
  addPosts: (post: POST[]) =>
    set((state) => ({
      posts: [...(state.posts || []), ...post],
    })),
}));
