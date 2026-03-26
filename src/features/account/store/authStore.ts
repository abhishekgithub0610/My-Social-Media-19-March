import { create } from "zustand";
import { persist } from "zustand/middleware";
type User = {
  id: string;
  email: string;
  role: string;

  // ✅ NEW (optional → won’t break anything)
  name?: string;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;

  setUser: (user: User, token: string) => void;
  clearUser: () => void;
};
// // type User = {
// //   id: string;
// //   email: string;
// //   role: string;
// //   accessToken: string;
// // };

// // type AuthState = {
// //   user: User | null;
// //   setUser: (user: User) => void;
// //   clearUser: () => void;
// // };
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null, // ✅ initialize

      setUser: (user, token) =>
        set({
          user,
          accessToken: token, // ✅ set token too
        }),

      clearUser: () =>
        set({
          user: null,
          accessToken: null, // ✅ clear token too
        }),
    }),
    { name: "auth-storage" }, // persists in localStorage
  ),
);
export const getAccessToken = () => useAuthStore.getState().accessToken;
// // export const useAuthStore = create<AuthState>((set) => ({
// //   user: null,
// //   accessToken: null,

// //   setUser: (user, token) =>
// //     set({
// //       user,
// //       accessToken: token,
// //     }),

// //   clearUser: () =>
// //     set({
// //       user: null,
// //       accessToken: null,
// //     }),
// // }));
// // export const useAuthStore = create<AuthState>((set) => ({
// //   user: null,

// //   setUser: (user) => set({ user }),

// //   clearUser: () => set({ user: null }),
// // }));

// // export const authStore = {
// //   user: null as null | { id: string; email: string },
// // };
