import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  name: string;
  profilePic?: string | undefined;
  bio?: string | undefined;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      updateUser: (user: User) => {
        set({ user })
      },
      login: (user) => {
        set({ isLoggedIn: true });
        set({ user });
      },
      logout: () => {
        set({ isLoggedIn: false })
        set({ user: null })
      },

    }),
    {
      name: "auth-storage",
    },
  ),
);
