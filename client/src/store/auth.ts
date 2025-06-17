import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => {
        set({ isLoggedIn: true });
        set({ user });
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
