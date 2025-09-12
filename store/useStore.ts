import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

type AppState = {
  user: User | null;
  promptBeforeLogin: string;
  setUser: (user: User | null) => void;
  setPromptBeforeLogin: (prompt: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  promptBeforeLogin: '',
  setUser: (user) => set({ user }),
  setPromptBeforeLogin: (prompt) => set({ promptBeforeLogin: prompt }),
}));