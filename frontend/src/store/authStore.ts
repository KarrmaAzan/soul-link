import { create } from "zustand";

type Persona = {
  id: number;
  name: string;
  niche: string;
  bio: string;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  personas?: Persona[];
  hasPersona?: boolean;
};

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  hydrateFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    set({
      token,
      user,
      hydrated: true,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    set({
      token: null,
      user: null,
      hydrated: true,
    });
  },

  hydrateFromStorage: () => {
    const token = localStorage.getItem("token");
    set({
      token,
      hydrated: true,
    });
  },
}));