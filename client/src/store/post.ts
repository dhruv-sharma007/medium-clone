import { create } from "zustand";
import type { POST } from "../vite-env";

interface POSTSTORE {
  posts: POST[];
  addPosts: (post: POST[]) => void;
  page: number;
  hasMore: boolean;
  setHasMore: (condition: boolean) => void;
  setPage: (page: number) => void;
}

export const usePostStore = create<POSTSTORE>((set) => ({
  posts: [],
  page: 1,
  hasMore: true,
  setHasMore: (condition: boolean) => set(() => ({ hasMore: condition })),
  setPage: (page: number) => set(() => ({ page })),
  addPosts: (post: POST[]) =>
    set((state) => ({
      posts: [...(state.posts || []), ...post],
    })),
}));
