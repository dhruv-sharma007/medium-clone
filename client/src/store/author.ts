import { create } from "zustand";
import type { POST } from "../vite-env";

interface IAuthor {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  bio: string;
  followers: number;
  following: number;
  postCount: number;
  isUserFollowing: boolean;
  isFollowedByAuthor: boolean;
  Blogs: POST[];
}

interface AuthorProfileStore {
  setProfile: (profile: IAuthor) => void;
  updateBlogPublishStatus: (postId: string, value: boolean) => void;
  authorProfile: IAuthor | null;
}

export const useAuthorProfileStore = create<AuthorProfileStore>((set) => ({
  authorProfile: null,
  setProfile: (profile: IAuthor) => set({ authorProfile: profile }),

  updateBlogPublishStatus: (postId: string, value: boolean) =>
    set((state) => {
      if (!state.authorProfile) {
        return state;
      }
      return {
        authorProfile: {
          ...state.authorProfile,
          Blogs: state.authorProfile.Blogs.map((post) =>
            post.id === postId ? { ...post, isPublished: value } : post,
          ),
        },
      };
    }),
}));
