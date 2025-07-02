import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "../types";
import { AUTH_CONFIG } from "../config";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: !!localStorage.getItem(AUTH_CONFIG.TOKEN_KEY),

      login: (token: string, user: User, permissions?: string[]) => {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
        set({
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: AUTH_CONFIG.STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
