import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  name: string;
  profilePic?: string;
  bio?: string;
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
      user: null, // should be null initially
      isLoggedIn: false,
      login: (user: User) => {
        set({ isLoggedIn: true, user });
      },
      logout: () => {
        set({ isLoggedIn: false, user: null });
      },
      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
