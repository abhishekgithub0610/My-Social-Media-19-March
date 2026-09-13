import { create } from "zustand";
import { persist } from "zustand/middleware";
type User = {
  id: string;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  setHydrated: () => void;
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isHydrated: false,

      setUser: (user, token) =>
        set({
          user,
          accessToken: token,
        }),

      clearUser: () =>
        set({
          user: null,
          accessToken: null,
        }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(); // ✅ IMPORTANT
      },
    },
  ),
);
export const getAccessToken = () => useAuthStore.getState().accessToken;
