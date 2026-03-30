import { get, put } from './client';
import type { User } from '../types';

export const getUsers = () =>
    get<User[]>('/users');

export const getUserById = (id: number) =>
    get<User>(`/users/${id}`);

export const loginUser =async (email: string,password: string) =>{
    const users =await get<User[]>('/users');
    return users.find(u => u.email === email && u.password === password);
}

export const updateUser = (id: number, userInfo: Partial<User>) =>
    put<User>(`/users/${id}`, userInfo);