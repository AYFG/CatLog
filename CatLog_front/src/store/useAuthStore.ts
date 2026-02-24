import { UserData } from "@/types/auth";
import { create } from "zustand";

interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  setUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));

