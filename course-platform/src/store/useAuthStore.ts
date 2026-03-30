import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState{
    user:User | null;
    isLogin:boolean;

    login:(user:User) => void;
    logout:() => void;
    updateUser:(userInfo:Partial<User>) => void;
    switchRole:(newRole:User['role']) => void;
}

export const useAuthStore = create(
persist<AuthState>(
  (set) => ({
  user: null,
  isLogin: false,
  
  login: (user) => set({ user, isLogin: true }),
  
  logout: () => set({ user: null, isLogin: false }),
  
  updateUser: (userInfo) => set((state) => ({
    user: state.user ? { ...state.user, ...userInfo } : null
  })),
  
  switchRole: (newRole) => set((state) => ({
    user: state.user ? { ...state.user, role: newRole } : null
  }))
}),
  {
    name: 'auth-storage', 
  }
));