import { create } from "zustand";

type User = {
  id: string;
  email: string;
  role: string;
  accessToken: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}));

// // export const authStore = {
// //   user: null as null | { id: string; email: string },
// // };
