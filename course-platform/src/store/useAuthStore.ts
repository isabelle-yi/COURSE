import { create } from 'zustand';
import type { User } from '../types';

interface AuthState{
    user:User | null;
    isLogin:boolean;

    login:(user:User) => void;
    logout:() => void;
    updateUser:(userInfo:Partial<User>) => void;
}

export const useAuthStore=create<AuthState>((set) => ({
    user:null,
    isLogin:false,
    login:(user) => set({ user, isLogin: true }),

    logout:() => set({ user: null, isLogin: false }),

    updateUser:(userInfo) => set((state) => ({
        user: state.user ? { ...state.user, ...userInfo } : null
    }))
}));